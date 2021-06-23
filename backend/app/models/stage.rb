# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study

  validate :only_one_stage_per_study_for_now, on: :create
  before_create :set_return_id, :set_order

  protected

  def set_order
    self.order = (Stage.maximum(:order) || -1) + 1
  end

  def set_return_id
    self.return_id = SecureRandom.alphanumeric
  end

  def only_one_stage_per_study_for_now
    errors.add(:base, 'Only one stage per study for the moment') if study.stages.any?
    errors.any?
  end
end
