# frozen_string_literal: true

FactoryBot.define do
  factory :banner do
    message { Faker::Lorem.sentences(number: 1) }
    start_at { (rand * 10).to_i.days.ago }
    end_at { (rand * 10).to_i.days.from_now }
  end
end
