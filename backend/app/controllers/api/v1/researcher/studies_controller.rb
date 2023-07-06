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

  def show
    response_binding = Api::V1::Bindings::Study.create_from_model(@study)
    render json: response_binding, status: :ok
  end

  def update
    inbound_binding, error = bind(params.require(:study), Api::V1::Bindings::StudyUpdate)
    render(json: error, status: error.status_code) and return if error

    notify_researchers(inbound_binding.researchers || [])
    # TODO: after fleshed out instructions
    # @study.reopen_if_possible(inbound_binding.to_hash)
    @study.update(inbound_binding.to_hash.except(:researchers, :stages))

    unless inbound_binding.stages.nil?
      @study.stages.clear
      inbound_binding.stages.each do |stage|
        s = Stage.where(id: stage.id).find_or_create_by(stage.to_hash.merge({ config: {} }))
        @study.stages << s
      end
    end

    response_binding = Api::V1::Bindings::Study.create_from_model(@study)
    render json: response_binding, status: :ok
  end

  def update_status
    unless params[:study].empty? || params[:study].nil?
      study_update, error = bind(params[:study], Api::V1::Bindings::StudyUpdate)
      render(json: error, status: error.status_code) and return if error

      @study.update(study_update.to_hash.except(:researchers, :stages))
    end

    @study.update_status!(params[:status_action], params[:stage_index])

    render json: Api::V1::Bindings::Study.create_from_model(@study), status: :ok
  end

  def destroy
    @study.update!(is_hidden: true)
    head :ok
  end

  protected

  def notify_researchers(researchers)
    new_researcher_ids = researchers.map(&:id)
    old_researcher_ids = @study.study_researchers.map(&:researcher_id)

    added_researchers_ids = (new_researcher_ids - old_researcher_ids) - [@current_researcher.id]
    removed_researchers_ids = (old_researcher_ids - new_researcher_ids) - [@current_researcher.id]

    researchers.each do |researcher|
      next unless added_researchers_ids.include?(researcher.id)

      @study.study_researchers.create!(
        researcher_id: researcher.id,
        role: researcher.role
      )
    end

    removed_researchers_ids.each do |removed_researcher_id|
      @study.study_researchers.delete(
        @study.study_researchers.find_by(researcher_id: removed_researcher_id)
      )
    end

    ResearcherNotifications.notify_study_researchers(@study.study_researchers, [], @study, @current_researcher)
  end

  def set_study
    @study = Study.find(params[:id])
    raise SecurityTransgression unless @study.researchers.include?(current_researcher)
  end
end
