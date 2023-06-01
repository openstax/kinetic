# frozen_string_literal: true

class Api::V1::Admin::StudiesController < Api::V1::Admin::BaseController

  def index
    render status: :ok, json: query_studies(params[:status])
  end

  def approve
    Study.find(params[:id]).stages.update_all status: 'ready_for_launch'
    render status: :ok, json: query_studies('waiting_period')
  end

  def responses
    render status: :ok, json: responses_for_study(Study.find(params[:id]))
  end

  def add_response
    stage = Stage.find(params[:stage_id])
    if params[:file]
      exp = stage.response_exports.build({
                                           is_complete: true,
                                           is_testing: params[:is_testing],
                                           cutoff_at: Time.now
                                         })
      exp.files.attach(params[:file])
      exp.save!
    end
    render status: :ok, json: responses_for_study(stage.study)
  end

  def destroy_response
    exp = ResponseExport.find(params[:id])
    exp.destroy!
    render status: :ok, json: responses_for_study(exp.stage.study)
  end

  protected

  def responses_for_study(study)
    Api::V1::Bindings::ResponsesListing.new(
      data: study.response_exports.map do |resp|
        resp.attributes_for_binding(Api::V1::Bindings::ResponseExport).tap do |json|
          json['urls'] = resp.files.map { |f| url_for(f) }
        end
      end
    )
  end

  def query_studies(status)
    studies = Study.joins(:stages)
    studies = studies.where({ stages: { status: Stage.statuses[status] } }) unless status == 'all'
    studies = studies.order(:created_at).distinct
    Api::V1::Bindings::Studies.new(
      data: studies.map do |study|
        Api::V1::Bindings::Study.create_from_model(study)
      end
    )
  end
end
