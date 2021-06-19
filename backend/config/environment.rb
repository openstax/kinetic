# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

require 'errors'
require 'rescue_from_unless_local'
# require 'v0_bindings_extensions'

# Initialize the Rails application.
Rails.application.initialize!
