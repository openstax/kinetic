# frozen_string_literal: true

class Api::V1::Admin::LearningPathsController < Api::V1::Admin::BaseController
  before_action :set_learning_path, only: [:update, :destroy]
  skip_before_action :render_unauthorized_unless_admin!, only: [:index]

  def index
    render status: :ok,
           json: Api::V1::Bindings::LearningPaths.new(
             data: LearningPath.includes(:studies).all.map do |learning_path|
               Api::V1::Bindings::LearningPath.create_from_model(learning_path)
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

    unless inbound_binding.studies.nil?
      @learning_path.study_ids = inbound_binding.studies&.map(&:id)
    end
    @learning_path.update!(inbound_binding.to_hash.except(:studies, :badge))

    render json: Api::V1::Bindings::LearningPath.create_from_model(@learning_path), status: :ok
  end

  def destroy
    @learning_path.destroy
  end

  private

  def set_learning_path
    @learning_path = LearningPath.find(params[:id])
  end
end
