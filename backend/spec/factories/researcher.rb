FactoryBot.define do
  factory :researcher do
    user_id { SecureRandom.uuid }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end
end
