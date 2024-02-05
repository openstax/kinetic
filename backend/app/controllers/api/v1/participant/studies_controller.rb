# frozen_string_literal: true

class Api::V1::Participant::StudiesController < Api::V1::BaseController
  before_action :render_unauthorized_unless_signed_in!
  before_action :set_study, only: [:launch, :land, :stats]

  def index
    launched_studies = current_user.launched_studies.includes(:stages, study: [:researchers])
                         .filter { |ls| ls.study.available? || ls.completed? }

    available_studies = Study.available_to_participants.includes(:stages, :researchers)
                          .where.not(id: launched_studies.map(&:study_id))

    studies = launched_studies + available_studies

    response_binding = Api::V1::Bindings::ParticipantStudies.new(
      data: Api::V1::Bindings::ParticipantStudy.create_from_models_list(studies, current_user)
    )

    render json: response_binding, status: :ok
  end

  def show
    # TODO: Should this match logic in participant controller
    model =
      current_user.available_launched_studies.where(study_id: params[:id]).first ||
      Study.available_to_participants.find(params[:id])
    raise ActiveRecord::RecordNotFound if model.is_hidden?

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

  def stats
    return unless params[:view]

    @study.increment(:view_count, 1).save

    render json: @study
  end

  def land
    if params[:md]
      ParticipantMetadatum.create!(
        user_id: current_user.id,
        study_id: @study.id,
        metadata: params[:md]
      )
    end

    completion_status = launch_pad.land(
      consent: params[:consent] != 'false',
      aborted: params[:aborted]
    )

    render json: Api::V1::Bindings::ParticipantStudyCompletion.new(completion_status)
  end

  protected

  def set_study
    @study = Study.find(params[:study_id])
  end

  def launch_pad
    @launch_pad ||= LaunchPad.new(study_id: @study.id, user_id: current_user.id)
  end
end
