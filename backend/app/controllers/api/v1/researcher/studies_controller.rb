# frozen_string_literal: true

class Api::V1::Researcher::StudiesController < Api::V1::Researcher::BaseController

  before_action :set_study, only: [:update, :destroy, :show]

  def create
    inbound_binding, error = bind(params.require(:study), Api::V1::Bindings::NewStudy)
    render(json: error, status: error.status_code) and return if error

    created_study = inbound_binding.create_model!(researcher: current_researcher)

    response_binding = Api::V1::Bindings::Study.create_from_model(created_study)
    render json: response_binding, status: :created
  end

  def index
    studies = current_researcher.studies.includes(:researchers, :stages, :first_launched_study)
    response_binding = Api::V1::Bindings::Studies.new(
      data: studies.map do |study|
              Api::V1::Bindings::Study.create_from_model(study)
            end
    )
    render json: response_binding, status: :ok
  end

  def show
    response_binding = Api::V1::Bindings::Study.create_from_model(@study)
    render json: response_binding, status: :ok
  end

  def update
    inbound_binding, error = bind(params.require(:study), Api::V1::Bindings::StudyUpdate)
    render(json: error, status: error.status_code) and return if error

    inbound_binding.update_model!(@study)

    response_binding = Api::V1::Bindings::Study.create_from_model(@study)
    render json: response_binding, status: :ok
  end

  def destroy
    @study.update!(is_hidden: true)
    head :ok
    # render json: @study, status: :ok
  end

  protected

  def set_study
    @study = Study.find(params[:id])
    raise SecurityTransgression unless @study.researchers.include?(current_researcher)
  end
end
