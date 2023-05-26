#!/usr/bin/env ruby
# frozen_string_literal: true

FactoryBot.define do
  factory :response_export do

    is_complete { true }
    is_empty { false }
    is_testing { true }

    stage

    after(:build) do |exp|
      exp.files.attach(io: File.open(Rails.root.join('spec', 'factories', 'response_export.rb')), filename: 'my-own-factory.rb', content_type: 'text/plain')
    end

  end
end
