# frozen_string_literal: true

class StudyResearcher < ApplicationRecord
  belongs_to :study
  belongs_to :researcher
  enum role: [:member, :pi, :lead], _default: 'member'

  before_destroy :check_destroy_leaves_another_researcher_in_study

  def user_id
    researcher.user_id
  end

  protected

  def check_destroy_leaves_another_researcher_in_study
    return true if study.researchers.size > 1

    errors.add(:base, "Researcher #{researcher.user_id} is the last researcher " \
                      "for study #{study.id} and cannot be deleted")
    raise ActiveRecord::RecordInvalid, self
  end
end
