# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study

  before_create { self.first_launched_at ||= Time.now }

  def completed?
    completed_at.present?
  end

  def launched_stages
    raise "NYI"
    # LaunchedStage.where()
  end
end
