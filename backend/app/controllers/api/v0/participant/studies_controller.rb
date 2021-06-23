# frozen_string_literal: true

class Api::V0::Participant::StudiesController < Api::V0::BaseController
  before_action :render_unauthorized_if_no_current_user

  def create
    inbound_binding, error = bind(params.require(:study), Api::V0::Bindings::Researcher::NewStudy)
    render(json: error, status: error.status_code) and return if error

    created_study = inbound_binding.create_model!(researcher: current_researcher)

    response_binding = Api::V0::Bindings::Researcher::Study.create_from_model(created_study)
    render json: response_binding, status: :created
  end

  def index
    studies = current_researcher.studies
    response_binding = Api::V0::Bindings::Researcher::Studies.new(
      data: studies.map do |study|
              Api::V0::Bindings::Researcher::Study.create_from_model(study)
            end
    )
    render json: response_binding, status: :ok
  end

end
