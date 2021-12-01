# frozen_string_literal: true

class Api::V1::Participant::StudiesController < Api::V1::BaseController
  before_action :render_unauthorized_unless_signed_in!
  before_action :set_study, only: [:launch, :land]

  def index
    launched_studies = current_user.launched_studies.includes(study: [:researchers])

    unlaunched_studies = current_user.eligible_studies.includes(:researchers)
                                     .where.not(id: launched_studies.map(&:study_id))

    studies = launched_studies + unlaunched_studies

    response_binding = Api::V1::Bindings::ParticipantStudies.new(
      data: studies.map do |study|
              Api::V1::Bindings::ParticipantStudy.create_from_model(study)
            end
    )
    render json: response_binding, status: :ok
  end

  def show
    model =
      current_user.launched_studies.where(study_id: params[:id]).first ||
      Study.open.find(params[:id])
    response_binding = Api::V1::Bindings::ParticipantStudy.create_from_model(model)
    render json: response_binding, status: :ok
  end

  def launch
    url = launch_pad.launch_url(preview: params[:preview] == 'true')
    response_binding = Api::V1::Bindings::Launch.new(url: url)
    render json: response_binding, status: :ok
  end

  def land
    if params[:abort] && !launch_pad.abort(params[:abort])
      head :not_acceptable, 'invalid reason code'
      return
    end

    launch_pad.land
    head :ok
  end

  protected

  def set_study
    @study = Study.find(params[:study_id])
  end

  def launch_pad
    @launch_pad ||= LaunchPad.new(study_id: @study.id, user_id: current_user.id)
  end

end
