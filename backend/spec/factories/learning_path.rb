# frozen_string_literal: true

FactoryBot.define do
  factory :learning_path do
    label { Faker::Hobby.activity }
    description { Faker::Hobby.activity }
    badge_id { 'SAJS8Va7DGDaC3D' }
  end
end
