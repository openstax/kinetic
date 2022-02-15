# frozen_string_literal: true

class LaunchedStage < ApplicationRecord
  belongs_to :stage
  belongs_to :research_id, foreign_key: :user_id, primary_key: :user_id

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
