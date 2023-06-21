# frozen_string_literal: true

class Api::V1::Researcher::ResponsesController < ApplicationController

  include ActionController::HttpAuthentication::Token::ControllerMethods

  def fetch
    (status, responses) = find_or_create_responses(
      params[:cutoff] ? params[:cutoff].to_date : Date.today,
      !has_enclaves_token?
    )

    render status: status, json: Api::V1::Bindings::Responses.new(
      status: responses.all?(&:is_complete) ? 'complete' : 'pending',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )
  end

  private

  def find_or_create_responses(cutoff, is_testing)
    analysis = Analysis.find_by(api_key: params[:api_key])
    return [:not_found, []] if analysis.nil?

    # add a day so that it gets everything that's contained in the day requested
    responses = analysis.response_exports
                  .for_cutoff(cutoff + 1.day)
                  .where(is_testing: is_testing).to_a
    if responses.none? && is_testing
      responses = analysis.stages.map do |stage|
        stage.response_exports.create!(
          is_testing: is_testing, cutoff_at: cutoff
          )
      end
    end
    [:ok, responses]
  end

  def has_enclaves_token?
    authenticate_with_http_token do |token, _o|
      Rails.application.secrets.enclave_api_key == token
    end
  end

end
