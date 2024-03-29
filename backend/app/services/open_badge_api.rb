# frozen_string_literal: true

require 'json'
require 'singleton'

class OpenBadgeApi
  include Singleton

  def initialize
    @client_id = ENV.fetch('OBF_CLIENT_ID', nil)
    @client_secret = ENV.fetch('OBF_CLIENT_SECRET', nil)
  end

  def token
    Rails.cache.fetch('obf-api-oauth-token', expires_in: 36_000) do
      response = HTTPX.accept('application/json')
                   .post('https://openbadgefactory.com/v1/client/oauth2/token', form: {
                           grant_type: 'client_credentials',
                           client_id: @client_id,
                           client_secret: @client_secret
                         })
      @token = response.json['access_token']
    end
  end

  def badge_info(badge_id)
    Rails.cache.fetch("obf-badge-#{badge_id}", expires_in: 86_400) do
      response = HTTPX.plugin(:auth)
                   .with(headers: { 'content-type' => 'application/json' })
                   .authorization("Bearer #{token}")
                   .get("https://openbadgefactory.com/v1/badge/#{@client_id}/#{badge_id}")
      data = response.json

      return {} if data.blank?

      {
        name: data['name'],
        id: data['id'],
        description: data['description'],
        image: data['image'],
        tags: data['tags']
      }
    end
  end

end
