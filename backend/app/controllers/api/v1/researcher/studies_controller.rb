# frozen_string_literal: true

class Api::V1::Researcher::StudiesController < Api::V1::Researcher::BaseController

  before_action :set_study, only: [:update, :destroy, :show, :update_status]

  def create
    inbound_binding, error = bind(params.require(:study), Api::V1::Bindings::NewStudy)
    render(json: error, status: error.status_code) and return if error

    created_study = inbound_binding.create_model!(researcher: current_researcher)
    inbound_binding.stages&.each do |s|
      created_study.stages << Stage.new(s.to_hash.merge({ config: {} }))
    end

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

  def public_studies
    studies = current_researcher.studies.includes(:researchers, :stages, :first_launched_study)
    all_studies = (studies + Study.public_to_researchers).uniq
    response_binding = Api::V1::Bindings::Studies.new(
      data: all_studies.map do |study|
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
    study_update, error = bind(params.require(:study), Api::V1::Bindings::StudyUpdate)
    render(json: error, status: error.status_code) and return if error

    notify_researchers(study_update.researchers || []) if study_update.researchers

    @study.update!(study_update.to_hash.except(:researchers, :stages))

    @study.update_stages(study_update.stages)

    @study.reopen_if_possible
    response_binding = Api::V1::Bindings::Study.create_from_model(@study)
    render json: response_binding, status: :ok
  end

  def update_status
    unless params[:study].empty? || params[:study].nil?
      study_update, error = bind(params[:study], Api::V1::Bindings::StudyUpdate)
      render(json: error, status: error.status_code) and return if error

      @study.update!(study_update.to_hash.except(:researchers, :stages))
      @study.update_stages(study_update.stages)
    end

    @study.update_status!(params[:status_action], params[:stage_index])

    notify_users_of_new_studies if params[:status_action] == 'launch'

    render json: Api::V1::Bindings::Study.create_from_model(@study), status: :ok
  end

  def notify_users_of_new_studies
    user_uuids = UserPreferences.where(study_available_email: true).pluck(:user_id)
    user_uuids.each do |uuid|
      user_info = UserInfo.for_uuid(uuid)

      recipient = Struct.new(:email_address, :full_name).new(
        user_info['email_address'] || 'Admin-Uno@test.openstax.org',
        user_info[:full_name]
      )

      UserMailer
        .with(user: recipient, study: @study)
        .new_studies
        .deliver_now
    end
  end

  def destroy
    @study.update!(is_hidden: true)
    head :ok
  end

  protected

  def notify_researchers(researchers)
    new_researchers = researchers.map do |new_researcher|
      { id: new_researcher.id, role: new_researcher.role }
    end
    old_researchers = @study.study_researchers.map do |old_researcher|
      { id: old_researcher.researcher_id, role: old_researcher.role }
    end

    return if new_researchers == old_researchers

    new_researchers.each do |researcher|
      @study.study_researchers.create!(
        researcher_id: researcher[:id],
        role: researcher[:role]
      )
    end

    old_researchers.each do |old_researcher|
      @study.study_researchers.delete(
        @study.study_researchers.find_by(
          researcher_id: old_researcher[:id],
          role: old_researcher[:role]
        )
      )
    end

    ResearcherNotifications.notify_study_researchers(@study, @current_researcher)
  end

  def set_study
    @study = Study.find(params[:id])
    raise SecurityTransgression unless @study.researchers.include?(current_researcher)
  end
end
