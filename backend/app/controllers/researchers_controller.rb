class ResearchersController < ApplicationController
  before_action :set_researcher, only: [:show, :update, :destroy]

  # GET /researchers
  def index
    @researchers = Researcher.all

    render json: @researchers
  end

  # GET /researchers/1
  def show
    render json: @researcher
  end

  # POST /researchers
  def create
    @researcher = Researcher.new(researcher_params)

    if @researcher.save
      render json: @researcher, status: :created, location: @researcher
    else
      render json: @researcher.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /researchers/1
  def update
    if @researcher.update(researcher_params)
      render json: @researcher
    else
      render json: @researcher.errors, status: :unprocessable_entity
    end
  end

  # DELETE /researchers/1
  def destroy
    @researcher.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_researcher
      @researcher = Researcher.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def researcher_params
      params.fetch(:researcher, {})
    end
end
