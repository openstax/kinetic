# frozen_string_literal: true

class UserNotifications
  class << self

    def deliver!
      deliver_welcomes
      deliver_new_studies
      deliver_additional_session
    end

    # GIVEN user is a registered Kinetic user
    # WHEN completing the demographic study
    def deliver_welcomes
      uuids = LaunchedStage
                .joins(:stages)
                .where(stages: {
                         config: { survey_id: Rails.application.secrets.demographic_survey_id }
                       })
                .group(:user_id)
                .pluck(:user_id)

      UserInfo.for_uuids(uuids).each_value do |user|
        UserMailer.with(user:).welcome.deliver
      end
    end

    # GIVEN the user has opted-in to receive new available studies email
    # WHEN a new study/studies becomes available on the learner dashboard
    def deliver_new_studies
      studies = Study.where(opens_at: yesterday)
                  .or(Study.where(opens_at: nil, created_at: yesterday))

      return unless studies.any?

      users = users_with_emails_for('new_studies')
      return unless users.any?

      users.each_value do |user|
        UserMailer.with(user:, studies:).new_studies.deliver
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
                        ).filter(&:next_stage_recently_available?)

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
      3.days.from_now..4.days.from_now
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
