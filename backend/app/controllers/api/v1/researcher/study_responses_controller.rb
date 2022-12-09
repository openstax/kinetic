# frozen_string_literal: true

class Api::V1::Researcher::StudyResponsesController < ApplicationController
  before_action :set_study

  def show
    responses = @study.study_response_exports.all
    pending = responses.any? { |r| !r.is_complete }

    api_binding = Api::V1::Bindings::StudyResponses.new(
      status: pending ? 'pending' : 'complete',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )
    render json: api_binding, status: :ok
  end

  def fetch
    @study.fetch_responses(is_testing: @is_testing)
    show
  end

  protected

  def set_study
    # TODO: set is_testing only when coming from outside network
    @is_testing = true
    @study = Study.find_by!(api_key: params[:api_key])
  end
end
