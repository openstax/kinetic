class User

  attr_reader :id

  def initialize(id)
    @id = user_id
  end

  def launched_studies
    ParticipantStudy.where(user_id: id)
  end

  def eligible_studies
    Study.open.all
  end

end
