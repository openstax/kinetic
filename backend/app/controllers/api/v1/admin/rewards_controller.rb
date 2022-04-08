# frozen_string_literal: true

class Api::V1::Admin::RewardsController < Api::V1::Admin::BaseController
  before_action :set_reward, only: [:update, :destroy]

  def index
    render status: :ok, json: Api::V1::Bindings::RewardsListing.new(
      data: Reward.order(start_at: 'asc').map { |reward|
              reward.to_api_binding(Api::V1::Bindings::Reward)
            }
    )
  end

  def destroy
    @reward.destroy!
    head :ok
  end

  def update
    inbound_binding, error = bind(params.require(:reward), Api::V1::Bindings::Reward)
    render(json: error, status: error.status_code) and return if error

    @reward.update!(inbound_binding.to_hash)

    render json: @reward.to_api_binding(Api::V1::Bindings::Reward), status: :ok
  end

  def create
    inbound_binding, error = bind(params.require(:reward), Api::V1::Bindings::Reward)
    render(json: error, status: error.status_code) and return if error

    reward = Reward.new(inbound_binding.to_hash)

    render json: { errors: reward.errors.full_messages }, status: 500 unless reward.save
    render json: inbound_binding, status: :created
  end

  protected

  def set_reward
    @reward = Reward.find(params[:id])
  end
end
