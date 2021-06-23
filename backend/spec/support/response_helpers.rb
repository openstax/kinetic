# frozen_string_literal: true

module ResponseHelpers
  def response_hash
    JSON.parse(response.body, symbolize_names: true)
  end

  def responses_not_exceptions!
    allow(Rails.application.config).to receive(:consider_all_requests_local).and_return(false)
  end
end
