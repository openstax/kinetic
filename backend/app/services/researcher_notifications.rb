# frozen_string_literal: true

class ResearcherNotifications
  class << self
    def notify_study_researchers(added_researchers, _removed_researchers, study, current_researcher)
      # Only added researchers for now. Eventually send removed researchers a different email
      uuids = added_researchers.map(&:user_id).uniq
      users_info = UserInfo.for_uuids(uuids)

      return if users_info.empty?

      users_info.each do |_, user|
        UserMailer.with(target_user: user, study: study,
                        current_user: current_researcher).invite_researcher_to_study.deliver
      end

      # We aren't supporting this feature for this iteration, but will in the future so leaving this for the future
      # removed_researchers.each do | researcher |
      #   user = users_info.find do | user_info |
      #     user_info[researcher.user_id]&.uuid == researcher.user_id
      #   end
      #   UserMailer.with(user: user[researcher.user_id]).remove_researcher_from_study.deliver
      # end
    end

    def notify_kinetic_study_review(study)
      UserMailer.with(study: study).submit_study_for_review.deliver
    end
  end
end
