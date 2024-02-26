# frozen_string_literal: true

class LearningPath < ApplicationRecord
  has_many :studies

  default_scope { order(created_at: :desc) }
end
