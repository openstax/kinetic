# frozen_string_literal: true

class Analysis < ApplicationRecord

  has_many :analysis_researchers
  has_many :researchers, through: :analysis_researchers

  has_many :runs, class_name: 'AnalysisRun'
  has_many :study_analyses
  has_many :studies, through: :study_analyses
  has_many :stages, through: :studies
  has_many :response_exports, through: :stages

  attribute :api_key, :string, default: -> { SimpleStructuredSecrets.new('a', 'n').generate }

  validates :title, presence: true

  before_destroy(prepend: true) do
    study_analyses.destroy_all
    analysis_researchers.destroy_all
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
