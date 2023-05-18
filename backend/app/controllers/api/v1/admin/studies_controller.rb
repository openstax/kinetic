# frozen_string_literal: true

class Api::V1::Admin::StudiesController < Api::V1::Admin::BaseController
  before_action :set_study, only: [:approve]

  def index
    render status: :ok, json: studies_awaiting_approval
  end

  def approve
    @study.stages.update_all status: 'ready_for_launch'
    # @study.stages.each do |stage|
    #   stage.update({:status => :waiting_period})
    # end
    render status: :ok, json: studies_awaiting_approval
  end

  protected

  def studies_awaiting_approval
    studies = Study.joins(:stages).where(stages: { status: :waiting_period }).distinct
    Api::V1::Bindings::Studies.new(
      data: studies.map do |study|
        Api::V1::Bindings::Study.create_from_model(study)
      end
    )
  end

  def set_study
    @study = Study.find(params[:id])
  end
end
