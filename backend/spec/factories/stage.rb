# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    transient do
      path { SecureRandom.hex(6) }
    end

    available_after_days { 0 }
    duration_minutes { rand(1..50) }
    points { rand(1..50) }

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
