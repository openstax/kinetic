# frozen_string_literal: true

FactoryBot.define do
  factory :analysis_run do
    message { Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    analysis
  end
end
