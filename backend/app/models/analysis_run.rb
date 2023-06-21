# frozen_string_literal: true

class AnalysisRun < ApplicationRecord

  belongs_to :analysis

  delegate :id, :api_key, to: :analysis, prefix: :analysis

  attribute :api_key, :string, default: -> { SimpleStructuredSecrets.new('r', 'n').generate }
  attribute :started_at, :datetime, default: -> { Time.now }

end
