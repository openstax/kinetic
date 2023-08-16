# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
# require 'action_mailbox/engine'
# require 'action_text/engine'
# require 'action_view/railtie'
# require 'action_cable/engine'
# require "sprockets/railtie"
# require 'rails/test_unit/railtie'
require 'active_storage/attached'
ActiveSupport.on_load(:active_record) do
  include ActiveStorage::Reflection::ActiveRecordExtensions
  ActiveRecord::Reflection.singleton_class.prepend(ActiveStorage::Reflection::ReflectionExtension)
  include ActiveStorage::Attached::Model
end
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

Dotenv.load('/etc/.env', '.env', '.env.local')

module Kinetic
  def self.allow_stubbed_authentication?
    Rails.env.development? || Rails.env.test?
  end

  def self.is_production?
    Rails.application.routes.default_url_options[:host] == 'kinetic.openstax.org'
  end

  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    config.active_record.schema_format = :sql
    config.active_storage.routes_prefix = '/files'
    # config.active_storage.draw_routes = false
    # config.action_controller.default_protect_from_forgery = false
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
    config.session_store :cookie_store, key: 'session'

    # Required for all session management (regardless of session_store)
    config.middleware.use ActionDispatch::Cookies

    config.middleware.use config.session_store, config.session_options
  end
end
