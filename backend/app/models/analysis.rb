# frozen_string_literal: true

class Analysis < ApplicationRecord

  has_many :analysis_researchers
  has_many :researchers, through: :analysis_researchers

  has_many :study_analyses
  has_many :studies, through: :study_analyses

  has_many :analysis_response_exports, inverse_of: :analysis, dependent: :destroy

  validates :title, :repository_url, presence: true

  def responses_before(cutoff:, is_testing:)
    responses = analysis_response_exports
                  .where(is_testing: is_testing)
                  .where(AnalysisResponseExport.arel_table[:cutoff_at].lteq(cutoff))
                  .order(created_at: :desc)

    # if we didn't find any responses
    # or check for new if the earliest one is less than cutoff
    if responses.none? || responses.first.cutoff_at.to_date < cutoff.to_date
      responses = [analysis_response_exports.create!(is_testing: is_testing, cutoff_at: cutoff)]
    end

    responses
  end

  def can_read_study_id?(id)
    # TODO: eventually this will need to be updated to include "shared" studies
    researchers.find { |r| r.study_researchers.exists?(study_id: id) }
  end

  def reset_study_analysis_to_ids(ids)
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
