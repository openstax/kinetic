# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    transient do
      path { SecureRandom.hex(6) }
    end

    available_after_days { 1 }
    points { 10 }
    duration_minutes { 5 }
    feedback_types { ['Debrief, Personalized'] }

    config do
      {
        type: 'qualtrics',
        survey_id: Rails.application.credentials.qualtrics_template_survey_id,
        secret_key: Rails.application.credentials.qualtrics_template_survey_secret_key
      }
    end
    study
  end
end
