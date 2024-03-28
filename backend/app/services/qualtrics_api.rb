# frozen_string_literal: true

require 'tempfile'
require 'zip'

class QualtricsApi

  def initialize
    puts('qualtrics api key')
    puts(Rails.application.secrets.qualtrics_api_key)
    @http = HTTPX.with(
      headers: { 'X-API-TOKEN': Rails.application.secrets.qualtrics_api_key }
    ).plugin(:stream)
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

  # https://api.qualtrics.com/6b00592b9c013-start-response-export
  def start_response_export(survey_id, start_at, cutoff_at)
    params = {
      format: 'csv',
      useLabels: true,
      endDate: cutoff_at.iso8601,
      includeDisplayOrder: true
    }
    params[:startDate] = start_at.iso8601 if start_at.present?
    request('POST', "surveys/#{survey_id}/export-responses", json: params)['result']['progressId']
  end

  #  https://api.qualtrics.com/37e6a66f74ab4-get-response-export-progress
  def check_export_completion(survey_id, progress_id)
    request('GET', "surveys/#{survey_id}/export-responses/#{progress_id}")['result']
  end

  def fetch_export_file(survey_id, file_id, &block)
    resp = @http.get(path_to("surveys/#{survey_id}/export-responses/#{file_id}/file"), stream: true)

    raise "request failed: #{resp.status}" unless resp.status == 200

    Tempfile.create([survey_id, '.zip'], binmode: true) do |f|
      resp.each { |chunk| f.write(chunk) }
      f.flush

      Zip::File.open(f) do |zip|
        zip.each(&block)
      end

    end
  end

  def delete_survey(survey_id)
    request('DELETE', "surveys/#{survey_id}")
  end

  def list_surveys(url='surveys')
    result = request('GET', url)['result']
    if result['nextPage'].present?
      result['elements'] + list_surveys(result['nextPage'].sub(/.*surveys/, 'surveys'))
    else
      result['elements']
    end
  end

  # https://api.qualtrics.com/9d0928392673d-get-survey
  def get_survey_definition(survey_id, format: nil)
    Rails.cache.fetch(
      "qualtrics-survey-definition/#{survey_id}",
      expires_in: Rails.env.production? ? 6 : 0
    ) do
      fqp = format ? "?format=#{format}" : ''
      request('GET', "survey-definitions/#{survey_id}#{fqp}")['result']
    end
  end

  def get_survey_definition_questions(stage)
    body = get_survey_definition(stage.config['survey_id'])
    body['Questions'].map { |_, qdata| OpenStruct.new(qdata) }
  end

  def path_to(suffix)
    "#{Rails.application.secrets.qualtrics_api_url}/#{suffix}"
  end

  def request(method, path, json: nil)
    resp = @http.request(
      method,
      path_to(path),
      json:
    )

    # timeout, host not found errors won't have a body
    resp.raise_for_status if resp.is_a? HTTPX::ErrorResponse

    body = resp.body.read
    unless resp.status == 200
      body = JSON.pretty_generate(JSON.parse(body.force_encoding('UTF-8'))) # sometimes qualtrics seems to returns invalid UTF
      raise "request failed: #{resp.status} #{body}"
    end

    JSON.parse(body)
  end

end
