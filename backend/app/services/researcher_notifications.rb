# frozen_string_literal: true

class ResearcherNotifications
  class << self
    def notify_study_researchers(study, current_researcher)
      uuids = study.study_researchers.map(&:user_id).uniq - [current_researcher.user_id]
      users_info = UserInfo.for_uuids(uuids)

      return if users_info.empty?

      users_info.each do |_, user|
        UserMailer.with(target_user: user, study: study,
          current_user: current_researcher).invite_researcher_to_study.deliver
      end
    end

    def notify_kinetic_study_review(study)
      UserMailer.with(study: study).submit_study_for_review.deliver
    end
  end
end
