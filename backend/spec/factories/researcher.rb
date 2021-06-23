# frozen_string_literal: true

FactoryBot.define do
  factory :researcher do
    user_id { SecureRandom.uuid }
    name { Faker::Name.name }
    bio { Faker::Lorem.sentences(number: 1) }
    institution { Faker::University.name }
  end
end
