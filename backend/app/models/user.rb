class User

  attr_reader :id

  def initialize(id)
    @id = id
  end

  def launched_studies
    LaunchedStudy.where(user_id: id)
  end

  def launched_stages
    LaunchedStage.where(user_id: id)
  end

  def eligible_studies
    Study.open.all
  end

end
