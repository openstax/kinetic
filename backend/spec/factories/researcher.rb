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
    trait :with_avatar do
      after :build do |researcher|
        file_name = 'tela.jpg'
        file_path = Rails.root.join('spec', 'fixtures', 'files', file_name)
        researcher.avatar.attach(io: File.open(file_path), filename: file_name, content_type: 'image/jpg')
      end
    end
  end
end
