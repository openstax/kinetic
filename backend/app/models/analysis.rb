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

  def can_read_study_id?(id)
    # TODO: eventually this will need to be updated to include "shared" studies
    researchers.find { |r| r.study_researchers.exists?(study_id: id) }
  end

  def reset_study_analysis_to_ids(ids=[])
    study_analyses.destroy(
      study_analyses.reject { |sa| ids.find { |id| id == sa.study_id } }.to_a
    )

    ids.each do |id|
      next if study_analyses.find { |sa| id == sa.study_id } ||
              !can_read_study_id?(id)

      study_analyses.create(study_id: id)
    end
  end

end
