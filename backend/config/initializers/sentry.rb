# frozen_string_literal: true

if Rails.env.production? || ENV['FORCE_ENABLE_SENTRY'] == 'true'
  secrets = Rails.application.secrets.sentry
  if secrets.nil?
    warn 'No sentry secrets provided; not configuring Sentry!'
    return
  end
  Sentry.init do |config|
    config.dsn = secrets[:dsn]
    config.breadcrumbs_logger = [:active_support_logger, :http_logger]

    config.environment = ENV['ENV_NAME'] || Rails.application.secrets.accounts[:env_name]

    # for performance, to see only 50% of all errors use 0.5
    config.traces_sample_rate = 1.0

    config.traces_sampler = lambda do |_context|
      true
    end
  end
end
