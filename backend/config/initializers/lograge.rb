# frozen_string_literal: true

Rails.application.configure do
  config.lograge.enabled = true

  config.log_tags = [:remote_ip] if Rails.env.production?
  config.lograge.base_controller_class = 'ActionController::API'
  config.lograge.custom_options = lambda do |event|
    exceptions = %w[controller action format id]
    {
      params: event.payload[:params].except(*exceptions)
    }
  end
end
