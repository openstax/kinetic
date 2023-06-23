# frozen_string_literal: true

class Api::V1::Enclave::RunsController < Api::V1::BaseController

  before_action :render_forbidden_unless_enclave_api_key!
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
    head :ok
  end

  def completion
    @run.messages.create(level: 'error', stage: 'end', message: params[:error]) if params[:error]
    @run.update!(
      did_succeed: params[:status] == 'success',
      finished_at: Time.now
    )
    EnclaveMailer.completed(@run).deliver
    @run.attach_output(params[:output_path]) if @run.did_succeed?
    head :ok
  end

  protected

  def find_run
    @run = AnalysisRun.find_by(api_key: params[:api_key])
  end
end
