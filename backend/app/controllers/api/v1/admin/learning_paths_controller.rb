# frozen_string_literal: true

class Api::V1::Admin::LearningPathsController < Api::V1::Admin::BaseController
  before_action :set_learning_path, only: [:update, :destroy]
  skip_before_action :render_unauthorized_unless_admin!, only: [:index]

  def index
    render status: :ok,
           json: Api::V1::Bindings::LearningPaths.new(
             data: LearningPath.all.map do |learning_path|
               learning_path.to_api_binding(Api::V1::Bindings::LearningPath)
             end
          )
  end

  def create
    inbound_binding, error = bind(params.require(:learning_path), Api::V1::Bindings::LearningPath)
    render(json: error, status: error.status_code) and return if error

    learning_path = LearningPath.new(inbound_binding.to_hash)

    unless learning_path.save
      render json: { errors: learning_path.errors.full_messages },
             status: 500
    end
    render json: learning_path, status: :created
  end

  def update
    inbound_binding, error = bind(params.require(:learning_path), Api::V1::Bindings::LearningPath)
    render(json: error, status: error.status_code) and return if error

    @learning_path.update!(inbound_binding.to_hash)

    render json: @learning_path.to_api_binding(Api::V1::Bindings::LearningPath),
           status: :ok
  end

  def destroy
    @learning_path.destroy
  end

  private

  def set_learning_path
    @learning_path = LearningPath.find(params[:id])
  end
end
