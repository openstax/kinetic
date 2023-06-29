# frozen_string_literal: true

class Api::V1::Researcher::AnalysisController < Api::V1::Researcher::BaseController

  def index
    analysis = current_researcher.analysis.includes(:study_analyses)
    response_binding = Api::V1::Bindings::AnalysisListing.new(
      data: analysis.map { |a| Api::V1::Bindings::Analysis.create_from_model(a) }
    )
    render json: response_binding, status: :ok
  end

  def show
    analysis = current_researcher.analysis.find(params[:id])
    response_binding = Api::V1::Bindings::Analysis.create_from_model(analysis)
    render json: response_binding, status: :ok
  end

  def create
    inbound_binding, error = bind(params.require(:analysis), Api::V1::Bindings::Analysis)
    render(json: error, status: error.status_code) and return if error

    update = inbound_binding.to_hash
    created = Analysis.new(update) do |analysis|
      analysis.researchers << current_researcher
      analysis.save!
      analysis.reset_study_analysis_to_ids(update[:study_ids]) if update[:study_ids].present?
    end

    response_binding = Api::V1::Bindings::Analysis.create_from_model(created)
    render json: response_binding, status: :created
  end

  def update
    analysis = current_researcher.analysis.find(params[:id])
    inbound_binding, error = bind(params.require(:analysis), Api::V1::Bindings::AnalysisUpdate)

    render(json: error, status: error.status_code) and return if error

    update = inbound_binding.to_hash
    study_ids = update.delete(:studies)&.pluck(:study_id)
    analysis.reset_study_analysis_to_ids(study_ids) if study_ids.present?
    analysis.update(update)

    if analysis.errors.any?
      render(json: analysis.errors.full_messages.first, status: 422) and return
    end

    response_binding = Api::V1::Bindings::Analysis.create_from_model(analysis)
    render json: response_binding, status: :ok
  end

end
