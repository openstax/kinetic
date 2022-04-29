# frozen_string_literal: true

class Api::V1::Participant::StudiesController < Api::V1::BaseController
  before_action :render_unauthorized_unless_signed_in!
  before_action :set_study, only: [:launch, :land]

  def index
    launched_studies = current_user.launched_studies.includes(study: [:researchers])
                         .order(completed_at: 'desc').uniq(&:study_id)

    unlaunched_studies = Study.available.includes(:researchers)
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
      Study.available.find(params[:id])
    response_binding = Api::V1::Bindings::ParticipantStudy.create_from_model(model, current_user)
    render json: response_binding, status: :ok
  end

  def launch
    LaunchedStudy.transaction do
      url = launch_pad.launch_url(preview: params[:preview] == 'true')
      response_binding = Api::V1::Bindings::Launch.new(url: url)
      render json: response_binding, status: :ok
    end
  end

  def land
    if params[:md]
      ParticipantMetadatum.create!(
        user_id: current_user.id,
        study_id: @study.id,
        metadata: params[:md]
      )
    end
    if params[:aborted]
      return head(
        launch_pad.abort(params[:aborted]) ? :ok : :not_acceptable
      )
    end

    # If param present, must be string "true", if absent, default to true
    consent = params[:consent] ? params[:consent] == 'true' : true
    launch_pad.land(consent: consent)
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
