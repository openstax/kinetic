# frozen_string_literal: true

class Study < ApplicationRecord
  has_many :study_researchers
  has_many :researchers, through: :study_researchers
end
