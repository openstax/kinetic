# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
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
