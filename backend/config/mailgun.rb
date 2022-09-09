#!/usr/bin/env ruby

Mailgun.configure do |config|
  config.api_key = ENV['MG_API_KEY']
end
