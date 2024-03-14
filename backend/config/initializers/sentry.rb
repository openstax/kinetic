# frozen_string_literal: true

if Rails.env.production? || ENV['FORCE_ENABLE_SENTRY'] == 'true'
  secrets = Rails.application.credentials.sentry
  if secrets.nil?
    warn 'No sentry secrets provided; not configuring Sentry!'
    return
  end
  Sentry.init do |config|
    config.dsn = secrets[:dsn]
    config.breadcrumbs_logger = [:active_support_logger, :http_logger]
    config.environment = ENV.fetch('ENV_NAME') { Rails.application.credentials.accounts[:env_name] }
    config.traces_sampler = lambda do |context|
      case context[:transaction_context][:name]
      when /^\/api\/v\d+\/eligibility/ then 0.001 # eligibility is loaded from REX and can have huge traffic
      else 0.1
      end
      true
    end
  end
end
