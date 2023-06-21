# frozen_string_literal: true

class AnalysisRunMessage < ApplicationRecord

  belongs_to :analysis_run
  has_one :analysis, through: :analysis_run

  enum stage: { archive: 1, review: 2, package: 3, run: 4, check: 5 }
  enum level: { info: 1, error: 2, debug: 3 }

end
