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

  # PATCH/PUT /researchers/1
  def update
    # TODO @nathan this blows up on:
    #  NoMethodError (undefined method `build_from_hash' for File:Class):
    inbound_binding, error = bind(params, Api::V1::Bindings::ResearcherUpdate)
    render(json: error, status: error.status_code) and return if error
    if params[:avatar]
      @researcher.avatar.attach(params[:avatar])
    end

    # @researcher.update!(inbound_binding.to_hash)
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
