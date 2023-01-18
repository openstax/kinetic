# frozen_string_literal: true

class Api::V1::Researcher::ResponsesController < ApplicationController
  before_action :set_analysis

  def show
    responses = @analysis.analysis_response_exports.all
    pending = responses.any? { |r| !r.is_complete }

    api_binding = Api::V1::Bindings::Responses.new(
      status: pending ? 'pending' : 'complete',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )
    render json: api_binding, status: :ok
  end

  def fetch
    @analysis.fetch_responses(is_testing: @is_testing)
    show
  end

  protected

  def set_analysis
    # TODO: set is_testing only when coming from outside network
    @is_testing = true
    @analysis = Analysis.find_by!(api_key: params[:api_key])
  end
end
