# frozen_string_literal: true

class Api::V1::Researcher::ResponsesController < ApplicationController
  before_action :set_analysis

  def fetch
    cutoff = params[:cutoff] ? params[:cutoff].to_date : Date.today
    analysis = Analysis.find_by!(api_key: params[:api_key])
    # TODO: set is_testing only when coming from outside network
    responses = analysis.responses_before(cutoff: cutoff, is_testing: true)

    pending = responses.any? { |r| !r.is_complete }

    api_binding = Api::V1::Bindings::Responses.new(
      status: pending ? 'pending' : 'complete',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )

    render json: api_binding, status: :ok
  end

  protected

  def set_analysis; end
end
