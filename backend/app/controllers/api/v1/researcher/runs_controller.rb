# frozen_string_literal: true

class Api::V1::Researcher::RunsController < Api::V1::BaseController

  before_action :render_forbidden_unless_enclave_api_key!

  def create
    analysis = Analysis.find(params[:analysis_id])
    run = analysis.runs.create({ message: params[:run][:message] })

    attributes = run.attributes_for_binding(Api::V1::Bindings::AnalysisRun).merge(
      'analysis_id' => run.analysis_id,
      'analysis_api_key' => run.analysis.api_key
    )
    response_binding = Api::V1::Bindings::AnalysisRun.new(attributes)

    render json: response_binding, status: :created
  end

end
