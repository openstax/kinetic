# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study

  before_create { self.first_launched_at ||= Time.now }

  scope :complete, -> { where.not(completed_at: nil) }

  def completed?
    completed_at.present?
  end

  def completed_with_consent!
    update!(completed_at: Time.now, consent_granted: true)
  end

  def refuse_to_consent!
    update!(aborted_at: Time.now, consent_granted: false)
  end
end
