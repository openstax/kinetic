# frozen_string_literal: true

class Researcher < ApplicationRecord
  has_many :study_researchers
  has_many :studies, through: :study_researchers, inverse_of: :researchers

  validates :user_id, uuid: true, uniqueness: true
end
