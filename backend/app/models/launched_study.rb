# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study

  before_create { self.first_launched_at ||= Time.now }

  scope :complete, -> { where.not(completed_at: nil) }

  def completed?
    completed_at.present?
  end

  def retakeable?
    completed_at == opted_out_at
  end

  def completed!(consent: true)
    update!(completed_at: Time.now, consent_granted: consent)
  end

  def aborted!
    update!(aborted_at: Time.now)
  end
end
