# frozen_string_literal: true

require 'json'

class OpenBadgeApi

  def initialize
    @client_id = ENV.fetch('OPEN_BADGE_FACTORY_CLIENT_ID', nil)
    @client_secret = ENV.fetch('OPEN_BADGE_FACTORY_CLIENT_SECRET', nil)
    @token = authenticate
    # return unless @client_id.nil? || @client_secret.nil?
    # warn('OpenBadgeApi credentials missing')

  end

  def authenticate
    # expires_in 36000 from OBF, check if ms or seconds
    Rails.cache.fetch('open-badge-api-oauth-token', expires_in: 600) do
      response = HTTPX.accept('application/json').post('https://openbadgefactory.com/v1/client/oauth2/token', form: {
        grant_type: 'client_credentials',
        client_id: @client_id,
        client_secret: @client_secret
      })
      data = JSON.parse(response.body)
      data['access_token']
    end
  end

  def badge_info(badge_id)
    response = HTTPX.plugin(:auth, :compression)
               .with(headers: { "content-type" => "application/json" })
               .authorization("Bearer #{@token}")
               .get("https://openbadgefactory.com/v1/badge/#{@client_id}")
    # .get("https://openbadgefactory.com/v1/badge/#{badge_id}")
    debugger
    data = JSON.parse(response.body)
  end

end
