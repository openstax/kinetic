# frozen_string_literal: true

module Utilities
  module_function

  def real_production_deployment?
    ENV['ENV_NAME']&.downcase == 'production'
  end
end
