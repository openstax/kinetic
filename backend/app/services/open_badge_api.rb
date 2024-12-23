# frozen_string_literal: true

require 'json'
require 'singleton'
require 'uri'

class OpenBadgeApi
  include Singleton

  def initialize
    @client_id = Rails.application.secrets.dig(:obf, :client_id)
    @client_secret = Rails.application.secrets.dig(:obf, :client_secret)
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

  def fetch_badges
    response = HTTPX.plugin(:auth)
                 .with(headers: { 'content-type' => 'application/json' })
                 .authorization("Bearer #{token}")
                 .get("https://openbadgefactory.com/v1/badge/#{@client_id}")

    json_objects = response.body.to_s.split("\n").map(&:strip).reject(&:empty?)
    json_objects.map { |json_str| JSON.parse(json_str) }
  end

  def badge_info(badge_id)
    return if badge_id.blank?

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
        criteria_html: data['criteria_html'],
        description: data['description'],
        image: data['image'],
        tags: data['tags']
      }
    end
  end

  # Can also use this format:
  # "Firstname Lastname <email@example.com>"
  def issue_badge(badge_id, emails)
    HTTPX.plugin(:auth)
      .with(headers: { 'content-type' => 'application/json' })
      .authorization("Bearer #{token}")
      .post("https://openbadgefactory.com/v1/badge/#{@client_id}/#{badge_id}", json: {
              recipient: emails
            })
  end

  def get_event_id(badge_id, email, called: false)
    data = fetch_event_response(email)

    matching_item = data.find { |item| item['badge_id'] == badge_id }

    if matching_item.nil? || matching_item.empty?
      issue_badge(badge_id, [email]) unless called
      return get_event_id(badge_id, email, called: true)
    end

    matching_item['id']
  end

  def get_pdf(badge_id, email)
    event_id = get_event_id(badge_id, email)

    # Fetching the pdf link
    pdf_response = HTTPX.plugin(:auth)
                     .with(headers: { 'content-type' => 'application/json' })
                     .authorization("Bearer #{token}")
                     .get("https://openbadgefactory.com/v1/event/#{@client_id}/#{event_id}/assertion")

    data = JSON.parse(pdf_response)
    pdf_link = data['pdf']['en']

    # Fetching the pdf from pdf_link
    pdf_response = HTTPX.plugin(:auth)
                     .authorization("Bearer #{token}")
                     .get(pdf_link)

    { pdf: pdf_response.body }
  end

  private

  def fetch_event_response(email)
    # Response is an octet stream
    
    base_url = "https://openbadgefactory.com/v1/event/#{@client_id}"
    query_params = URI.encode_www_form(email: email)

    url = "#{base_url}?#{query_params}"

    response = HTTPX.plugin(:auth)
                    .with(headers: { 'content-type' => 'application/json' })
                    .authorization("Bearer #{token}")
                    .get(url)

    json_objects = response.body.to_s.split("\n").map(&:strip).reject(&:empty?)
    json_objects.map { |json_str| JSON.parse(json_str) }
  end
end
