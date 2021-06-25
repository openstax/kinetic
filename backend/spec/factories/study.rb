# frozen_string_literal: true

FactoryBot.define do
  factory :study do
    transient do
      researchers { [] }
      title { nil }
    end

    title_for_researchers { title || 'Title for researchers' }
    title_for_participants { title || 'Title for participants' }
    short_description { 'A short description' }
    long_description { 'A long description' }
    duration_minutes { 15 }
    category { 'research_study' }
    opens_at { 3.days.ago }
    closes_at { 3.days.from_now }

    after(:create) do |study, evaluator|
      researchers = [evaluator.researchers].flatten.compact
      researchers = [create(:researcher)] if researchers.empty?
      study.researchers << researchers
    end
  end
end
