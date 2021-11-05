# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
# require 'active_storage/engine'
require 'action_controller/railtie'
# require 'action_mailer/railtie'
# require 'action_mailbox/engine'
# require 'action_text/engine'
# require 'action_view/railtie'
# require 'action_cable/engine'
# require "sprockets/railtie"
# require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

Dotenv.load('/etc/.env', '.env')

module Kinetic
  def self.allow_stubbed_authentication?
    Rails.env.development? || Rails.env.test?
  end

  def self.is_production?
    Rails.application.routes.default_url_options[:host] == 'kinetic.openstax.org'
  end

  class Application < Rails::Application
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '/api/v0/swagger*', headers: :any, methods: [:get, :options, :head]
      end
      allow do
        origins 'localhost:4000'
        resource '/development/*', {
          headers: :any,
          credentials: true,
          methods: [:get, :options, :head, :put, :delete]
        }
      end
      allow do
        origins ['localhost:4000', '*.openstax.org']
        resource '/api/*', {
          headers: :any,
          credentials: true,
          methods: [:get, :options, :head, :put, :delete, :post]
        }
      end
    end

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.middleware.use ActionDispatch::Cookies if Kinetic.allow_stubbed_authentication?
  end
end
