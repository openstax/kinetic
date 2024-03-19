# frozen_string_literal: true

FactoryBot.define do
  factory :study do
    transient do
      researchers { [] }
      num_stages { 1 }
      title { nil }
    end

    title_for_researchers { title || Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    title_for_participants { title || Faker::Lorem.paragraph_by_chars(number: rand(20..45)) }
    short_description { Faker::Lorem.paragraph_by_chars(number: rand(40..120)) }
    long_description { Faker::Lorem.paragraph_by_chars(number: rand(80..250)) }
    internal_description { Faker::Lorem.paragraph_by_chars(number: rand(80..250)) }
    category { 'Research' }
    topic { 'Learning' }
    subject { 'Biology' }
    benefits { Faker::Lorem.paragraph_by_chars(number: rand(50..170)) }
    image_id { 'Schoolfuturecareer_1' }
    target_sample_size { 100 }
    opens_at { 30.days.ago }
    closes_at { 30.days.from_now }

    after(:create) do |study, evaluator|
      researchers = [evaluator.researchers].flatten.compact
      researchers = [create(:researcher)] if researchers.empty?
      study.researchers << researchers

      FactoryBot.create_list(:stage, evaluator.num_stages, study:)

      study.launch
    end
  end
end
