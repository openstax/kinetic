# frozen_string_literal: true

class StudyResearcher < ApplicationRecord
  belongs_to :study
  belongs_to :researcher
end
