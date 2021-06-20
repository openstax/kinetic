# frozen_string_literal: true

class Api::V0::BaseController < ApplicationController
  include Swagger::Blocks
  include OpenStax::Swagger::Bind

  rescue_from_unless_local StandardError, send_to_sentry: true do |ex|
    render json: binding_error(status_code: 500, messages: [ex.message]), status: 500
  end

  rescue_from NotAuthorized do |_ex|
    head :unauthorized
  end

  rescue_from_unless_local ActiveRecord::RecordNotFound do |_ex|
    head :not_found
  end

  rescue_from_unless_local ActiveRecord::RecordInvalid, ActionController::ParameterMissing do |ex|
    render json: binding_error(status_code: 422, messages: [ex.message]), status: 422
  end

  rescue_from_unless_local SecurityTransgression do |_ex|
    head :forbidden
  end

  protected

  def validate_not_production
    head :unauthorized if Utilities.production_deployment?
  end

  def validate_current_user_authorized_as_admin
    head :unauthorized unless current_user_authorized_as_admin?
  end

  def current_user_authorized_as_admin?
    return false if Rails.application.secrets.admin_uuids.blank?

    allowed_uuids = Rails.application.secrets.admin_uuids.split(',').map(&:strip)
    allowed_uuids.include?(current_user_uuid)
  end

  def binding_error(status_code:, messages:)
    Api::V0::Bindings::Error.new(status_code: status_code, messages: messages)
  end
end
