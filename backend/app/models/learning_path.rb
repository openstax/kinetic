# frozen_string_literal: true

class LearningPath < ApplicationRecord
  has_many :studies, dependent: :restrict_with_error

  default_scope { order(created_at: :desc) }
end
