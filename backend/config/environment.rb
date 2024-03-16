# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

require 'errors'
require 'rescue_from_unless_local'
require 'cookie_authentication'
require 'utilities'
require 'unique_token'
Dir[Rails.root.join('lib', 'patches', '**', '*.rb')].each { |f| require f }
Dir[Rails.root.join('lib', 'validators', '**', '*.rb')].each { |f| require f }

puts "WHATSUP!"
puts Rails.env
# Initialize the Rails application.
Rails.application.initialize!
