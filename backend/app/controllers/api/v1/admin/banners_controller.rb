# frozen_string_literal: true

class Api::V1::Admin::BannersController < Api::V1::Admin::BaseController

  before_action :set_banner, only: [:update, :destroy]

  def index
    render status: :ok, json: Api::V1::Bindings::BannersListing.new(
      data: Banner.all.map { |banner| banner.to_api_binding(Api::V1::Bindings::BannerNotice) }
    )
  end

  def destroy
    @banner.destroy!
    head :ok
  end

  def update
    inbound_binding, error = bind(params.require(:banner), Api::V1::Bindings::BannerNotice)
    render(json: error, status: error.status_code) and return if error

    @banner.update!(inbound_binding.to_hash)

    render json: @banner.to_api_binding(Api::V1::Bindings::BannerNotice), status: :ok
  end

  def create
    inbound_binding, error = bind(params.require(:banner), Api::V1::Bindings::BannerNotice)
    render(json: error, status: error.status_code) and return if error

    banner = Banner.new(inbound_binding.to_hash)

    render json: { errors: banner.errors.full_messages }, status: 500 unless banner.save
    render json: inbound_binding, status: :created
  end

  protected

  def set_banner
    @banner = Banner.find(params[:id])
  end
end
