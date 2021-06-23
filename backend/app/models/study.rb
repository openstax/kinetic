# frozen_string_literal: true

class Study < ApplicationRecord
  has_many :study_researchers, dependent: :destroy
  has_many :researchers, through: :study_researchers, dependent: :destroy
  has_many :stages, dependent: :destroy

  # Delete researchers to avoid them complaining about not leaving a researcher undeleted
  before_destroy(prepend: true) { study_researchers.delete_all }
end
