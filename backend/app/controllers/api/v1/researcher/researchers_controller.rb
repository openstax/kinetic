# frozen_string_literal: true

class Api::V1::Researcher::ResearchersController < Api::V1::Researcher::BaseController
  before_action :set_researcher, only: [:show, :update, :destroy]

  # GET /researchers
  def index
    @researchers = Researcher.all
    response_binding = Api::V1::Bindings::Researcher.new(
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

  # POST /researchers
  def create
    inbound_binding, error = bind(params.require(:researcher), Api::V1::Bindings::Researcher)
    render(json: error, status: error.status_code) and return if error

    researcher = Researcher.new(inbound_binding.to_hash)

    render json: { errors: researcher.errors.full_messages }, status: 500 unless researcher.save
    render json: inbound_binding, status: :created
  end

  # PATCH/PUT /researchers/1
  def update
    inbound_binding, error = bind(params.require(:researcher), Api::V1::Bindings::Researcher)
    render(json: error, status: error.status_code) and return if error

    # TODO Make sure avatar works

    @researcher.update!(inbound_binding.to_hash)
    render json: @researcher.to_api_binding(Api::V1::Bindings::Researcher), status: :ok
  end

  # DELETE /researchers/1
  def destroy
    @researcher.destroy!
    head :ok
  end

  protected

  # Use callbacks to share common setup or constraints between actions.
  def set_researcher
    @researcher = Researcher.find(params[:id])
  end
end
