# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

# We allow access from certain localhost domains
# to allow developers to use test local front-ends without
# running the server locally
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:4000'
    resource '/development/*', {
      headers: :any,
      credentials: true,
      methods: [:get, :options, :head, :put, :delete]
    }
  end
  allow do
    # allow rex development to load eligibility api
    origins ['localhost:3000', /herokuapp.com$/]
    resource '/api/v1/eligibility', {
      headers: :any,
      credentials: true,
      methods: [:get]
    }
  end
  allow do
    origins ['localhost:4000', 'localhost:4008', /openstax.org$/]
    resource '/api/*', {
      headers: :any,
      credentials: true,
      methods: [:get, :options, :head, :put, :delete, :post]
    }
    resource '/files/*', {
      headers: :any,
      credentials: true,
      methods: [:get, :options, :head, :put, :delete, :post]
    }
  end
end
