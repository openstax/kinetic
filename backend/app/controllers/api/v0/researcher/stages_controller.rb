# frozen_string_literal: true

class Api::V0::Researcher::StagesController < Api::V0::Researcher::BaseController

  before_action :set_stage, only: [:show, :update, :destroy]
  before_action :set_study
  before_action :verify_access!

  def create
    inbound_binding, error = bind(params.require(:stage), Api::V0::Bindings::NewStage)
    render(json: error, status: error.status_code) and return if error

    created_stage = inbound_binding.create_model!(study: @study)

    response_binding = Api::V0::Bindings::Stage.create_from_model(created_stage)
    render json: response_binding, status: :created
  end

  def show
    response_binding = Api::V0::Bindings::Stage.create_from_model(@stage)
    render json: response_binding, status: :ok
  end

  def update
    inbound_binding, error = bind(params.require(:stage), Api::V0::Bindings::StageUpdate)
    render(json: error, status: error.status_code) and return if error

    inbound_binding.update_model!(@stage)

    response_binding = Api::V0::Bindings::Stage.create_from_model(@stage)
    render json: response_binding, status: :ok
  end

  def destroy
    @stage.destroy!
    head :ok
  end

  protected

  def set_stage
    @stage = Stage.find(params[:id])
  end

  def set_study
    @study = @stage ? @stage.study : Study.find(params[:study_id] || params[:id])
  end

  def verify_access!
    raise SecurityTransgression unless @study.researchers.include?(current_researcher) ||
                                       current_user_is_admin?
  end
end
