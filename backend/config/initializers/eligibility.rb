# frozen_string_literal: true

module Kinetic
  config = YAML.load_file(
    Rails.root.join('config', 'eligibility.yml')
  )

  ELIGIBLE_COUNTRY_CODES = Set.new(config['allowed_country_codes'])
  NON_ELIGIBLE_BOOKS = Set.new(config['disallowed_books'])
end
