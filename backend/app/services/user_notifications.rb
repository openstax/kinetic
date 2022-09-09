class UserNotifications
  class << self

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

    def deliver_new_prize_cycle
      users = users_with_emails_for('prize_cycle')
      return unless users.any?

      reward = Reward.find_by(start_at: yesterday)
      return unless reward.present?

      users.each do |_, user|
        UserMailer.with(user: user, reward: reward).new_prize_cycle.deliver
      end
    end

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
                   .joins(:study)
                   .sum('studies.participation_points')
        if points < points_needed
          UserMailer.with(user: user, reward: reward).upcoming_prize_cycle_deadline.deliver
        end
      end
    end

    def deliver_new_studies
      studies = Study.where(opens_at: yesterday).or(Study.where(opens_at: nil,
                                                                created_at: yesterday))
      return unless studies.any?

      users = users_with_emails_for('new_studies')
      return unless users.any?

      users.each do |_, user|
        UserMailer.with(user: user, studies: studies).new_studies.deliver
      end
    end

    def deliver_additional_session
      prev_launches = LaunchedStage
                        .complete
                        .multi_stage
                        .where('user_id in (?)', user_ids_with_emails_for('session_available'))
                        .filter do |launch|

        next_stage = launch.unlaunched_next_stage

        next_stage.present? && next_stage.delayed? &&
          (launch.completed_at + next_stage.available_after_days.days).to_date == Date.today
      end
      users = UserInfo.for_uuids(prev_launches.map(&:user_id))
      prev_launches.each do |launch|
        user = users[launch.user_id]
        next unless user.present? && user[:email_address]

        UserMailer.with(user: user, study: launch.study).additional_session.deliver
      end
    end

    private

    def yesterday
      Date.yesterday..Date.today
    end

    def near_future
      Date.today + 3.days..Date.today + 4.days
    end

    def user_ids_with_emails_for(type)
      UserPreferences.where([["#{type}_email", 't']].to_h).pluck(:user_id)
    end

    def users_with_emails_for(type)
      UserInfo.for_uuids(user_ids_with_emails_for(type))
    end

    def params
      { from: 'noreply@mg.kinetic.openstax.org' }
    end

  end
end
