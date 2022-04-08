FactoryBot.define do
  factory :reward do
    description { Faker::Lorem.sentences(number: 1) }
    points { (rand * 20).to_i }
    start_at { (rand * 10).to_i.days.ago }
    end_at { (rand * 10).to_i.days.from_now }
  end
end
