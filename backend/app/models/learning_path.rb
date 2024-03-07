# frozen_string_literal: true

class LearningPath < ApplicationRecord
  has_many :studies, -> { featured_order }

  default_scope { order(created_at: :desc) }
end
