# frozen_string_literal: true

class AnalysisRunMessage < ApplicationRecord

  belongs_to :analysis_run
  belongs_to :analysis, through: :analysis_run

  enum :stage, %i(:archive, :review, :build, :run, :validate)
  enum :level, %i(:info, :error, :debug)

end
