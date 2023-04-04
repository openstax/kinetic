# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    transient do
      path { SecureRandom.hex(6) }
    end

    available_after_days { 0 }
    points { 10 }
    duration_minutes { 5 }
    opens_at { 30.days.ago }
    closes_at { 30.days.from_now }
    feedback_types { ['debrief, personalized'] }

    config do
      {
        type: 'qualtrics',
        survey_id: 'SV_12QHR3BE',
        secret_key: '1234567890123456'
      }
    end
    study
  end
end
