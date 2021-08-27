# frozen_string_literal: true

class User

  attr_reader :id

  def initialize(id)
    raise 'id must be a string' unless id.is_a?(String)

    @id = id
  end

  def launched_studies
    LaunchedStudy.where(user_id: id)
  end

  def launched_stages(study:)
    LaunchedStage.where(user_id: id).joins(:stage).where(stage: { study_id: study.id })
  end

  def eligible_studies
    Study.open
  end

  def launch_next_stage!(study)
    incomplete_launched_stage = launched_stages(study: study).incomplete.first
    launch = nil
    if incomplete_launched_stage
      launch = incomplete_launched_stage
    else
      completed_stage_ids = launched_stages(study: study).map(&:stage_id)
      stage = study.stages.where.not(id: completed_stage_ids).order(:order).first
      raise 'No stage to launch exists' if stage.nil?

      launch = LaunchedStage.create(stage_id: stage.id, user_id: id)
    end
    launch
  end
end
