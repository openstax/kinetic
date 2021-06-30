# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study
  has_many :launched_stages

  validate :only_one_stage_per_study_for_now, on: :create
  before_create :set_order

  def config
    self[:config]&.with_indifferent_access
  end

  protected

  def set_order
    self.order = (Stage.maximum(:order) || -1) + 1
  end

  def only_one_stage_per_study_for_now
    return true if Rails.env.test? && ENV['ALLOW_MULTIPLE_STAGES'] == 'true'

    errors.add(:base, 'Only one stage per study for the moment') if study.stages.any?
    errors.any?
  end
end
