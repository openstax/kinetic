# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

require 'errors'
require 'rescue_from_unless_local'
require 'utilities'
require 'unique_token'
Dir[Rails.root.join('lib', 'patches', '**', '*.rb')].sort.each { |f| require f }
Dir[Rails.root.join('lib', 'validators', '**', '*.rb')].sort.each { |f| require f }

# Initialize the Rails application.
Rails.application.initialize!
