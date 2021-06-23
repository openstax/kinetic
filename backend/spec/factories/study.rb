# frozen_string_literal: true

FactoryBot.define do
  factory :study do
    title_for_researchers { 'Title for researchers' }
    title_for_participants { 'Title for participants' }
    short_description { 'A short description' }
    long_description { 'A long description' }
    duration_minutes { 15 }
    category { 'research_study' }

    transient do
      researchers { [] }
    end

    after(:create) do |study, evaluator|
      researchers = [evaluator.researchers].flatten.compact
      researchers = [create(:researcher)] if researchers.empty?
      study.researchers << researchers
    end
  end
end
