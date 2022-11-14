# frozen_string_literal: true

FactoryBot.define do
  factory :study do
    transient do
      researchers { [] }
      num_stages { 0 }
      title { nil }
    end

    title_for_researchers { title || Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    title_for_participants { title || Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    short_description { Faker::Lorem.paragraph_by_chars(number: rand(40..120)) }
    long_description { Faker::Lorem.paragraph_by_chars(number: rand(40..120)) }
    tags { ['type:research_study'] }
    opens_at { 3.days.ago }
    closes_at { 3.days.from_now }

    after(:create) do |study, evaluator|
      researchers = [evaluator.researchers].flatten.compact
      researchers = [create(:researcher)] if researchers.empty?
      study.researchers << researchers
    end

    after(:create) do |study, evaluator|
      evaluator.num_stages.times do
        study.stages.create! attributes_for :stage
      end
    end
  end
end
