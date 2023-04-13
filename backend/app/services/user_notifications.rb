# frozen_string_literal: true

class UserNotifications
  class << self

    def deliver!
      deliver_welcomes
      deliver_new_prize_cycle
      deliver_prize_cycle_deadline
      deliver_new_studies
      deliver_additional_session
    end

    # GIVEN user is a registered Kinetic user
    # WHEN completing the demographic study
    def deliver_welcomes
      uuids = LaunchedStudy.joins(:study)
                .where(
                  study: { is_mandatory: true },
                  completed_at: yesterday
        )
                .group(:user_id) # just to make sure we don't send dupe emails
                .pluck(:user_id)

      UserInfo.for_uuids(uuids).each do |_, user|
        UserMailer.with(user: user).welcome.deliver
      end
    end

    # GIVEN the user has opted-in to receive new prize cycle emails
    # WHEN a new reward milestone begins (for each milestone within an entire cycle)
    def deliver_new_prize_cycle
      users = users_with_emails_for('prize_cycle')
      return unless users.any?

      reward = Reward.find_by(start_at: yesterday)
      return unless reward.present?

      users.each do |_, user|
        UserMailer.with(user: user, reward: reward).new_prize_cycle.deliver
      end
    end

    # GIVEN the user has opted-in to receive prize cycle deadline emails
    # WHEN an upcoming deadline is due in 72h AND the user hasn’t qualified for it yet
    def deliver_prize_cycle_deadline
      users = users_with_emails_for('prize_cycle')
      return unless users.any?

      reward = Reward.find_by(end_at: near_future)
      return unless reward.present?

      first_reward = Reward.order(:start_at).first
      points_needed = Reward.where('end_at <= ?', reward.end_at).sum(:points)

      users.each do |uuid, user|
        points = LaunchedStudy
                   .where('completed_at >= ? and user_id = ?', first_reward.start_at, uuid)
                   .joins(study: :stages)
                   .sum('stages.points')
        if points < points_needed
          UserMailer.with(user: user, reward: reward).upcoming_prize_cycle_deadline.deliver
        end
      end
    end

    # GIVEN the user has opted-in to receive new available studies email
    # WHEN a new study/studies becomes available on the learner dashboard
    def deliver_new_studies
      studies = Study.joins(:stages)
                     .where(stages: {opens_at: yesterday})
                     .or(Study.where(created_at: yesterday))

      return unless studies.any?

      users = users_with_emails_for('new_studies')
      return unless users.any?

      users.each do |_, user|
        UserMailer.with(user: user, studies: studies).new_studies.deliver
      end
    end

    # GIVEN the user has opted-in for two-part study email
    # WHEN the second part of a two-part study becomes available
    def deliver_additional_session
      prev_launches = LaunchedStage
                        .complete
                        .multi_stage
                        .where(
                          'user_id in (?)',
                          user_ids_with_emails_for('session_available', include_unset: true)
                        ).filter(&:next_stage_delayed_and_recently_available?)

      users = UserInfo.for_uuids(prev_launches.map(&:user_id))
      prev_launches.each do |launch|
        next unless users[launch.user_id]&.email_address

        UserMailer.with(user: users[launch.user_id], study: launch.study).additional_session.deliver
      end
    end

    private

    def yesterday
      Date.yesterday..Date.today
    end

    def near_future
      Date.today + 3.days..Date.today + 4.days
    end

    def user_ids_with_emails_for(type, include_unset: false)
      query = UserPreferences.where([["#{type}_email", 't']].to_h)
      query = query.or(UserPreferences.where([["#{type}_email", nil]].to_h)) if include_unset
      query.pluck(:user_id)
    end

    def users_with_emails_for(type)
      UserInfo.for_uuids(user_ids_with_emails_for(type))
    end

    def params
      { from: 'noreply@mg.kinetic.openstax.org' }
    end

  end
end
