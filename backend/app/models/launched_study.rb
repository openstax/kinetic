# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study, counter_cache: :completed_count

  before_create { self.first_launched_at ||= Time.now }

  scope :complete, -> { where.not(completed_at: nil) }

  def completed?
    completed_at.present?
  end

  def opted_out!
    update!(opted_out_at: Time.now, consent_granted: false)
  end

  # Chose not to reset opted_out_at, in case it might be useful to find students who changed thier mind between steps
  def consented!
    update!(consent_granted: true)
  end

  def completed!
    update!(completed_at: Time.now)
    completed = LaunchedStudy.where(study_id: study_id).complete.count
    Study.update_counters(study_id, completed_count: completed)
  end

  def aborted!
    update!(aborted_at: Time.now)
  end

  # convenience method to allows bindings to treat launched like a study
  def completed_count
    study.completed_count
  end

  def is_deleted?
    study.is_deleted?
  end
end
