# frozen_string_literal: true

class LaunchedStage < ApplicationRecord
  belongs_to :stage

  belongs_to :research_id, foreign_key: :user_id, primary_key: :user_id
  has_one :study, through: :stage

  has_many :stages, through: :study, class_name: 'Stage', foreign_key: :study_id,
                    primary_key: :study_id

  scope :multi_stage, -> {
    joins(:stages)
      .group('launched_stages.id')
      .having('count(stages.id) > 1')
  }

  before_validation do
    self.first_launched_at ||= Time.now
    self.research_id ||= ResearchId.for_user_id(user_id)
  end

  scope :incomplete, -> { where(completed_at: nil) }
  scope :complete, -> { where.not(completed_at: nil) }

  def unlaunched_next_stage
    stages
      .left_joins(:launches)
      .where('launched_stages.id is null')
      .where(Stage.arel_table[:order].gt(stage.order))
      .order(:order)
      .first
  end

  def incomplete?
    completed_at.nil?
  end

  def is_last?
    stage.study.stages.order(:order).last.id == stage_id
  end

  def completed!
    update!(completed_at: Time.now)
  end

  def next_stage_delayed_and_recently_available?
    next_stage = unlaunched_next_stage
    next_stage.present? && next_stage.delayed? &&
      (completed_at + next_stage.available_after_days.days).to_date == Date.yesterday
  end
end
