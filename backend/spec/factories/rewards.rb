# frozen_string_literal: true

FactoryBot.define do
  factory :reward do
    prize { Faker::Creature::Animal.name }
    points { (rand * 20).to_i }
    description { Faker::Hobby.activity }
  end
end
