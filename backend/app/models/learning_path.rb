# frozen_string_literal: true

class LearningPath < ApplicationRecord
  has_many :studies, -> { featured_order }

  default_scope { order(created_at: :desc) }

  def completed?(user)
    completed_studies = user.launched_studies.includes(
      :stages,
      study: [:researchers, :learning_path]
    ).filter(&:completed?).map(&:study_id)

    studies.map(&:id).all? { |id| completed_studies.include?(id) }
  end
end
