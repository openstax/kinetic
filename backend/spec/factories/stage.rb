# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    transient do
      path { SecureRandom.hex(6) }
    end

    available_after_days { 1 }
    points { 10 }
    duration_minutes { 5 }
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
