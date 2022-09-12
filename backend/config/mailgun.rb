#!/usr/bin/env ruby
# frozen_string_literal: true

Mailgun.configure do |config|
  config.api_key = ENV.fetch('MG_API_KEY', nil)
end
