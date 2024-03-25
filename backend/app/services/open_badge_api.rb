# frozen_string_literal: true

require 'json'

class OpenBadgeApi

  def initialize
    @client_id = ENV.fetch('OPEN_BADGE_FACTORY_CLIENT_ID', nil)
    @client_secret = ENV.fetch('OPEN_BADGE_FACTORY_CLIENT_SECRET', nil)
    return unless @client_id.nil? || @client_secret.nil?

    warn('OpenBadgeApi credentials missing')
  end

  def authenticate
    @token = data['access_token']
    @token = Rails.cache.fetch('open-badge-api-oauth-token', expires_in: 36000) do
      response = HTTPX.accept('application/json').post('https://openbadgefactory.com/v1/client/oauth2/token', form: {
        grant_type: 'client_credentials',
        client_id: @client_id,
        client_secret: @client_secret
      })
      data = JSON.parse(response.body)
      expires_in = data['expires_in']
      data['access_token']
    end

    debugger
  end

  def badge_info(badge_id)
    response = HTTPX.plugin(:auth).authorization("eyrandomtoken").get("https://google.com")
  end

end
