# frozen_string_literal: true

class QualtricsApi

  # https://api.qualtrics.com/9d0928392673d-get-survey
  def self.get_survey_definition_questions(stage)
    qltr = new

    body = Rails.cache.fetch(
      "#{stage.cache_key_with_version}/qualtrics-survey-definition",
      expires_in: Rails.application.secrets.export_cache_hours
    ) do
      qltr.get("survey-definitions/#{stage.config['survey_id']}")['result']
    end
    body['Questions'].map { |_, qdata| OpenStruct.new(qdata) }
  end

  def initialize
    @http = HTTPX.plugin(:compression).with(
      headers: { 'X-API-TOKEN': Rails.application.secrets.qualtrics_api_key }
    )
  end

  def get(path)
    resp = @http.get("#{Rails.application.secrets.qualtrics_api_url}/#{path}")
    raise "request failed: #{resp.body}" unless resp.status == 200

    JSON.parse(resp.body.read)
  end

end
