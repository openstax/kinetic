class ResearcherNotifications
  class << self
    def notify_study_researchers(added_researchers, removed_researchers)
      uuids = (added_researchers.map(&:user_id) + removed_researchers.map(&:user_id)).uniq
      users_info = UserInfo.for_uuids(uuids)

      added_researchers.each do | researcher |
        user = users_info.find do | user_info |
          user_info[researcher.user_id]&.uuid == researcher.user_id
        end
        UserMailer.with(user: user[researcher.user_id]).invite_researcher_to_study.deliver
      end

      removed_researchers.each do | researcher |
        user = users_info.find do | user_info |
          user_info[researcher.user_id]&.uuid == researcher.user_id
        end
        UserMailer.with(user: user[researcher.user_id]).remove_researcher_from_study.deliver
      end
    end

    def notify_kinetic_study_review(study)
      UserMailer.with(study: study).study_ready_for_review.deliver
    end
  end
end
