# frozen_string_literal: true

class LaunchedStage < ApplicationRecord
  belongs_to :stage

  before_create { self.first_launched_at ||= Time.now }

  scope :incomplete, -> { where(completed_at: nil) }
  scope :complete, -> { where.not(completed_at: nil) }

  def is_last?
    stage.study.stages.order(:order).last.id == stage_id
  end

  def completed!
    update!(completed_at: Time.now)
  end
end
