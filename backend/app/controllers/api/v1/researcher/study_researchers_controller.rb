# frozen_string_literal: true

class Api::V1::Researcher::StudyResearchersController < Api::V1::Researcher::BaseController

  before_action :set_study

  def create
    added_researcher = Researcher.find_or_create_by!(user_id: params[:user_id])

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
