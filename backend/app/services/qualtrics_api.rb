# frozen_string_literal: true

class QualtricsApi

  def initialize
    @http = HTTPX.plugin(:compression).with(
      headers: { 'X-API-TOKEN': Rails.application.secrets.qualtrics_api_key }
    )
  end

  def create_survey(definition)
    request('POST', 'survey-definitions', json: definition)['result']
  end

  def share_survey(survey_id, recipient_id, permissions)
    request('POST', "surveys/#{survey_id}/permissions/collaborations", json: {
      recipientId: recipient_id,
      permissions: {
        SurveyPermissions: permissions
      }
    }.deep_stringify_keys)
  end

  # https://api.qualtrics.com/9d0928392673d-get-survey
  def get_survey_definition(survey_id, format: nil)
    Rails.cache.fetch(
      "qualtrics-survey-definition/#{survey_id}",
      expires_in: Rails.application.secrets.export_cache_hours
    ) do
      fqp = format ? "?format=#{format}" : ''
      request('GET', "survey-definitions/#{survey_id}#{fqp}")['result']
    end
  end

  def get_survey_definition_questions(stage)
    body = get_survey_definition(stage.config['survey_id'])
    body['Questions'].map { |_, qdata| OpenStruct.new(qdata) }
  end

  def request(method, path, json: nil)
    resp = @http.request(
      method,
      "#{Rails.application.secrets.qualtrics_api_url}/#{path}",
      json: json
    )
    unless resp.status == 200
      body = resp.body.read
      File.write('/tmp/bad.json', JSON.pretty_generate(JSON.parse(body.force_encoding('UTF-8'))))

      raise "request failed: #{resp.status}"
    end

    JSON.parse(resp.body.read)
  end

end
