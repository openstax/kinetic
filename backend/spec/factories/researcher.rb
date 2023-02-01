# frozen_string_literal: true

FactoryBot.define do
  factory :researcher do
    user_id { SecureRandom.uuid }
    name { Faker::Name.name }
    bio { Faker::Lorem.sentences(number: 2) }
    institution { Faker::University.name }
    lab_page { Faker::TvShows::SiliconValley.url }
    research_interest_1 { Faker::Hobby.activity }
    research_interest_2 { Faker::Hobby.activity }
    research_interest_3 { Faker::Hobby.activity }
  end
end
