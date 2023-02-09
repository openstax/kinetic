# frozen_string_literal: true

FactoryBot.define do
  factory :researcher do
    user_id { SecureRandom.uuid }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    bio { Faker::Hipster.sentences }
    institution { Faker::University.name }
    lab_page { Faker::TvShows::SiliconValley.url }
    research_interest1 { Faker::Hobby.activity }
    research_interest2 { Faker::Hobby.activity }
    research_interest3 { Faker::Hobby.activity }
    trait :with_avatar do
      after :build do |researcher|
        file_name = 'tela.jpg'
        file_path = Rails.root.join('spec', 'fixtures', 'files', file_name)
        researcher.avatar.attach(io: File.open(file_path), filename: file_name, content_type: 'image/jpg')
      end
    end
  end
end
