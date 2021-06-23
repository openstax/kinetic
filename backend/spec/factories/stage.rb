# frozen_string_literal: true

FactoryBot.define do
  factory :stage do
    config do
      {
        type: 'qualtrics',
        url: 'https://foo.com',
        secret_key: 'abcdefg'
      }
    end
    study
  end
end
