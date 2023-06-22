# frozen_string_literal: true

class AnalysisRun < ApplicationRecord

  belongs_to :analysis

  has_many :messages, -> { order(created_at: :asc) }, class_name: 'AnalysisRunMessage'

  delegate :id, :api_key, to: :analysis, prefix: :analysis

  has_one_attached :output

  attribute :api_key, :string, default: -> { SimpleStructuredSecrets.new('r', 'n').generate }
  attribute :started_at, :datetime, default: -> { Time.now }

end
