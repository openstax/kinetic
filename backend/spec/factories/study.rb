# frozen_string_literal: true

FactoryBot.define do
  factory :study do
    name_for_researchers { 'Name for researchers' }
    name_for_participants { 'Name for participants' }
    description_for_researchers { 'Description for researchers' }
    description_for_participants { 'Description for participants' }
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
