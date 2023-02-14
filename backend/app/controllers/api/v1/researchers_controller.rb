# frozen_string_literal: true

class Api::V1::ResearchersController < Api::V1::Researcher::BaseController
  before_action :set_researcher, only: [:show, :update, :destroy]

  # GET /researchers
  def index
    @researchers = Researcher.all
    response_binding = Api::V1::Bindings::ResearchersList.new(
      data: @researchers.map do |researcher|
        Api::V1::Bindings::Researcher.create_from_model(researcher)
      end
    )
    render json: response_binding, status: :ok
  end

  # GET /researchers/1
  def show
    response_binding = Api::V1::Bindings::Researcher.create_from_model(@researcher)
    render json: response_binding, status: :ok
  end

  # POST /researchers/1/avatar_upload
  def avatar_upload
    @researcher = Researcher.find(params[:researcher_id])
    if params[:avatar]
      @researcher.avatar.attach(params[:avatar])
      @researcher.reload
    end
    render json: Api::V1::Bindings::Researcher.create_from_model(@researcher), status: :ok
  end

  # PATCH/PUT /researchers/1
  def update
    inbound_binding, error = bind(params.require(:researcher), Api::V1::Bindings::ResearcherUpdate)
    render(json: error, status: error.status_code) and return if error

    @researcher.update!(inbound_binding.to_hash)
    response_binding = Api::V1::Bindings::Researcher.create_from_model(@researcher)
    render json: response_binding, status: :ok
  end

  # DELETE /researchers/1
  def destroy
    @researcher.destroy!
    head :ok
  end

  protected

  def set_researcher
    @researcher = Researcher.find(params[:id])
  end
end
