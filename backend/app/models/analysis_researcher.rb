# frozen_string_literal: true

class AnalysisResearcher < ApplicationRecord

  belongs_to :analysis
  belongs_to :researcher

end
