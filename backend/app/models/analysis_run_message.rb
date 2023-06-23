# frozen_string_literal: true

class AnalysisRunMessage < ApplicationRecord

  belongs_to :analysis_run
  has_one :analysis, through: :analysis_run

  enum stage: [:archive, :review, :package, :run, :check, :end]
  enum level: [:info, :error, :debug]

end
