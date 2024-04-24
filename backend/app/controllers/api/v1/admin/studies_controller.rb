# frozen_string_literal: true

class Api::V1::Admin::StudiesController < Api::V1::Admin::BaseController

  def index
    render status: :ok, json: query_studies(params[:status])
  end

  def approve
    study = Study.find(params[:id])
    error404 unless study.present?
    study.approve
    render status: :ok, json: query_studies('waiting_period')
  end

  def feature
    params[:featured_ids].each_with_index do |study_id, index|
      Study.find(study_id).update(is_featured: true, featured_order: index)
    end

    Study.where(id: params[:non_featured_ids])
      .update_all(is_featured: false, featured_order: nil)

    render status: :ok, json: { success: true }
  end

  def highlight
    Study.where(id: params[:highlighted_ids])
      .update_all(is_highlighted: true)

    Study.where(is_highlighted: true)
      .where.not(id: params[:highlighted_ids])
      .update_all(is_highlighted: false)

    render status: :ok, json: { success: true }
  end

  def welcome
    Study.where(id: params[:welcome_ids])
      .update_all(is_welcome: true)

    Study.where(is_welcome: true)
      .where.not(id: params[:welcome_ids])
      .update_all(is_welcome: false)

    render status: :ok, json: { success: true }
  end

  def files
    render status: :ok, json: files_for_study(Study.find(params[:id]))
  end

  def add_response
    stage = Stage.find(params[:stage_id])
    if params[:file]
      exp = stage.response_exports.build(
        {
          is_complete: true,
          is_testing: params[:is_testing],
          cutoff_at: Time.now
        }
      )
      exp.files.attach(params[:file])
      exp.save!
    end
    render status: :ok, json: files_for_study(stage.study)
  end

  def add_info
    stage = Stage.find(params[:stage_id])
    if params[:file]
      stage.analysis_infos.attach(params[:file])
      stage.save!
    end
    render status: :ok, json: files_for_study(stage.study)
  end

  def destroy_info
    info = ActiveStorage::Attachment.find(params[:id])
    info.destroy!
    render status: :ok, json: files_for_study(info.record.study)
  end

  def destroy_response
    exp = ResponseExport.find(params[:id])
    exp.destroy!
    render status: :ok, json: files_for_study(exp.stage.study)
  end

  def responses
    study = Study.find(params[:id])
    listing = Api::V1::Bindings::ResponsesListing.new(
      data: study.response_exports.map do |resp|
        resp.attributes_for_binding(Api::V1::Bindings::ResponseExport).tap do |json|
          json['urls'] = resp.files.map { |f| url_for(f) }
        end
      end
    )
    render status: :ok, json: listing
  end

  protected

  def files_for_study(study)
    Api::V1::Bindings::AdminStudyFilesListing.new(
      responses: study.response_exports.map do |resp|
        resp.attributes_for_binding(Api::V1::Bindings::ResponseExport).tap do |json|
          json['urls'] = resp.files.map { |f| url_for(f) }
        end
      end,
      infos: study.stages.flat_map do |stage|
        stage.analysis_infos.map do |info|
          {
            id: info.id,
            stage_id: stage.id,
            created_at: info.created_at,
            url: url_for(info)
          }
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
