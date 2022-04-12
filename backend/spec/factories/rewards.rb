# frozen_string_literal: true

FactoryBot.define do
  factory :reward do
    prize { Faker::Creature::Animal.name }
    points { (rand * 20).to_i }
    start_at { (rand * 10).to_i.days.ago }
    end_at { (rand * 10).to_i.days.from_now }
  end
end
