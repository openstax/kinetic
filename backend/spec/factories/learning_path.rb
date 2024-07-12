# frozen_string_literal: true

FactoryBot.define do
  factory :learning_path do
    label { Faker::Hobby.activity }
    description { Faker::Hobby.activity }
    badge_id { 'SAJSINa7DGDaC4D' }
    color { '#B6DB93' }
  end
end
