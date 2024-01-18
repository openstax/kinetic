# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study, counter_cache: true
  has_many :stages, through: :study

  before_create { self.first_launched_at ||= Time.now }

  scope :complete, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }

  # forward a few methods so launched can be treated like a study
  delegate :completed_count, to: :study
  delegate :is_hidden?, to: :study

  def available_stages
    stage
  end

  def completed?
    completed_at.present?
  end

  def opted_out!
    update!(opted_out_at: Time.now, consent_granted: false)
  end

  # Chose not to reset opted_out_at, in case it might be useful to find students who changed their mind between steps
  def consented!
    update!(consent_granted: true)
  end

  def completed!
    update!(completed_at: Time.now)
    completed = LaunchedStudy.where(study_id: study_id).complete.count
    Study.update(study_id, completed_count: completed)
  end

  def aborted!
    update!(aborted_at: Time.now)
  end

end
