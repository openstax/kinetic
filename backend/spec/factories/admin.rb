# frozen_string_literal: true

FactoryBot.define do
  factory :admin do
    user_id { SecureRandom.uuid }
  end
end
