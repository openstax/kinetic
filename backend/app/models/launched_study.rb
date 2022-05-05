# frozen_string_literal: true

class LaunchedStudy < ApplicationRecord
  belongs_to :study
  has_many :launched_stages
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
  end

  def aborted!
    update!(aborted_at: Time.now)
  end
end
