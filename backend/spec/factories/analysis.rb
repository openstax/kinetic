# frozen_string_literal: true

FactoryBot.define do

  factory :analysis do

    transient do
      researchers { [] }
    end

    title { Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    description { Faker::Lorem.paragraph_by_chars(number: rand(40..120)) }
    repository_url { Faker::Internet.url }

    after(:create) do |analysis, evaluator|
      researchers = [evaluator.researchers].flatten.compact
      researchers = [create(:researcher)] if researchers.empty?
      analysis.researchers << researchers
    end

  end
end