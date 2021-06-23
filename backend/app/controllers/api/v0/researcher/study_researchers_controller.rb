# frozen_string_literal: true

class Api::V0::Researcher::StudyResearchersController < Api::V0::Researcher::BaseController

  before_action :set_study

  def create
    added_researcher = Researcher.find_or_create_by!(user_id: params[:user_id])

    # error = binding_error_from_model(added_researcher)
    # render(json: error, status: error.status_code) and return if error

    @study.researchers << added_researcher
    @study.save!

    head :created
  end

  def destroy
    researcher = Researcher.find_by!(user_id: params[:user_id])
    @study.researchers.destroy(researcher)
    head :ok
  end

  protected

  def set_study
    @study = Study.find(params[:study_id])
    raise SecurityTransgression unless @study.researchers.include?(current_researcher)
  end
end
