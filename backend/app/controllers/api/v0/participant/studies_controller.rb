# frozen_string_literal: true

class Api::V0::Participant::StudiesController < Api::V0::BaseController
  before_action :render_unauthorized_if_no_current_user
  before_action :set_study, only: [:show, :launch, :land]

  def index
    studies = current_user.eligible_studies + current_user.launched_studies
    response_binding = Api::V0::Bindings::ParticipantStudies.new(
      data: studies.map do |study|
              Api::V0::Bindings::Participant::Study.create_from_model(study)
            end
    )
    render json: response_binding, status: :ok
  end

  def show
    raise 'nyi'
  end

  def launch
    url = launch_pad.launch
    response_binding = Api::Vo::Bindings::Launch.new(url: url)
    render json: response_binding, status: :ok
  end

  def land
    launch_pad.land
    head :ok
  end

  protected

  def set_study
    @study = Study.find(params[:id])
  end

  def launch_pad
    @launch_pad ||= LaunchPad.new(study_id: @study.id, user_id: current_user.id)
  end

end
