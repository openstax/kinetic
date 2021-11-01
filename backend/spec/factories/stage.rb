# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    transient do
      path { SecureRandom.hex(6) }
    end

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
