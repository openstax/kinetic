# frozen_string_literal: true

class Analysis < ApplicationRecord

  has_many :analysis_researchers
  has_many :researchers, through: :analysis_researchers

  has_many :study_analyses
  has_many :studies, through: :study_analyses

  has_many :analysis_response_exports, inverse_of: :analysis, dependent: :destroy

  validates :title, :repository_url, presence: true

  def fetch_responses(is_testing:)
    resp = analysis_response_exports
             .find_by(is_testing: is_testing, is_complete: false)

    resp = analysis_response_exports.create(is_testing: is_testing) if resp.nil? || !resp.fresh?
    resp.fetch
  end

end
