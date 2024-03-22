# frozen_string_literal: true

require 'json'

class OpenBadgeApi

  def initialize
    @client_id = ENV['OPEN_BADGE_FACTORY_CLIENT_ID']
    @client_secret = ENV['OPEN_BADGE_FACTORY_CLIENT_SECRET']
    if @client_id.nil? || @client_secret.nil?
      warn('OpenBadgeApi credentials missing')
    end
  end

  def authenticate
    response = HTTPX.accept("application/json").post("https://openbadgefactory.com/v1/client/oauth2/token", form: {
      "grant_type": "client_credentials",
      "client_id": @client_id,
      "client_secret": @client_secret
    })
    data = JSON.parse(response.body)
    expires_in = data['expires_in']
    # @token = data['access_token']
    @token = Rails.cache.fetch('open-badge-api-oauth-token', expires_in:) do
      data['access_token']
    end

    debugger
  end

end
