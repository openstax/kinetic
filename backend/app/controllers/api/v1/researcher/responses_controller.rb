# frozen_string_literal: true

class Api::V1::Researcher::ResponsesController < ApplicationController

  include ActionController::HttpAuthentication::Token::ControllerMethods

  def fetch
    cutoff = params[:cutoff] ? params[:cutoff].to_date : Date.tomorrow
    analysis = Analysis.find_by!(api_key: params[:api_key])

    # TODO: set is_testing only when coming from outside network
    is_testing = !authenticate_with_http_token do |token, _o|
      Rails.application.secrets.enclave_api_key == token
    end

    responses = analysis.response_exports.for_cutoff(cutoff).where(is_testing: is_testing)

    if responses.none? && is_testing
      responses = []
      analysis.stages.each do |stage|
        responses << stage.response_exports.create!(
          is_testing: is_testing, cutoff_at: cutoff
        )
      end
    end

    pending = responses.any? { |r| !r.is_complete }

    api_binding = Api::V1::Bindings::Responses.new(
      status: pending ? 'pending' : 'complete',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )

    render json: api_binding, status: :ok
  end

end
