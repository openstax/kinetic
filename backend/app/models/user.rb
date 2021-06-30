# frozen_string_literal: true

class User

  attr_reader :id

  def initialize(id)
    @id = id
  end

  def launched_studies
    LaunchedStudy.where(user_id: id)
  end

  def launched_stages(study:)
    LaunchedStage.where(user_id: id).joins(:stage).where(stage: { study_id: study.id })
  end

  def eligible_studies
    Study.open.all
  end

end
