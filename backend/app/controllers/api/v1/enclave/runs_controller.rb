# frozen_string_literal: true

class Api::V1::Enclave::RunsController < Api::V1::BaseController

  before_action :forbid_unless_enclave_api_key!
  before_action :find_run, except: [:create]

  def create
    analysis = Analysis.find(params[:analysis_id])
    run = analysis.runs.create!({ message: params[:run][:message] })
    attributes = run.attributes_for_binding(Api::V1::Bindings::AnalysisRun).merge(
      'analysis_id' => run.analysis_id,
      'analysis_api_key' => run.analysis.api_key
    )
    response_binding = Api::V1::Bindings::AnalysisRun.new(attributes)

    render json: response_binding, status: :created
  end

  def log
    @run.messages.create(params.permit(:level, :message, :stage))
    render json: { success: true }
  end

  def completion
    @run.messages.create(level: 'error', stage: 'end', message: params[:error]) if params[:error]
    @run.update!(
      did_succeed: params[:status] == 'success',
      finished_at: Time.now
    )
    @run.output.attach(params[:output_signed_id]) if @run.did_succeed?
    url = @run.did_succeed? ? url_for(run.output) : analysis_url
    EnclaveMailer.completed(@run, url).deliver
    render json: { success: true }
  end

  # stolen from https://github.com/rails/rails/blob/6-1-stable/activestorage/app/controllers/active_storage/direct_uploads_controller.rb
  def upload_results
    args = params.require(:blob).permit(
      :filename, :byte_size, :checksum, :content_type, metadata: {}
    ).to_h.symbolize_keys
    blob = ActiveStorage::Blob.create_before_direct_upload!(**args)
    render json: direct_upload_json(blob)
  end

  private

  def direct_upload_json(blob)
    blob.as_json(root: false, methods: :signed_id).merge(
      direct_upload: {
        url: blob.service_url_for_direct_upload,
        headers: blob.service_headers_for_direct_upload
      }
    )
  end

  def find_run
    @run = AnalysisRun.find_by!(api_key: params[:api_key])
  end

  def analysis_url
    "#{request.protocol}#{request.host_with_port}/analysis/overview/#{@run.analysis_id}"
  end
end
