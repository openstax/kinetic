# frozen_string_literal: true

if Rails.env.production? || ENV['FORCE_ENABLE_SENTRY'] == 'true'
  secrets = Rails.application.secrets.sentry
  if secrets.nil?
    warn 'No sentry secrets provided; not configuring Sentry!'
    return
  end

  Raven.configure do |config|
    config.dsn = secrets[:dsn]
    config.current_environment = ENV['ENV_NAME'] || config.current_environment
    config.server_name = ENV['NICKNAME'] || config.server_name
  end
end
