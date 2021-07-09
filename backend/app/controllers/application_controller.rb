# frozen_string_literal: true

require 'openstax/auth/strategy_2'

class ApplicationController < ActionController::API
  include ActionController::Cookies if Labs.use_cookie_authentication?

  def error404
    render json: 'Bad Request', status: 404
  end

  protected

  include RescueFromUnlessLocal

  def validate_not_real_production
    head :unauthorized if Utilities.real_production_deployment?
  end

  def current_user_uuid
    @current_user_uuid ||=
      if Labs.use_cookie_authentication?
        if ENV['STUBBED_USER_UUID']
          ENV['STUBBED_USER_UUID']
        elsif cookies[:stubbed_user_uuid]
          cookies[:stubbed_user_uuid]
        end
      else
        if ENV['STUBBED_USER_UUID']
          Rails.logger.warn("`STUBBED_USER_UUID` environment variable is set but not used in " \
                            "the #{Rails.env} environment.")
        end

        OpenStax::Auth::Strategy2.user_uuid(request)
      end
  end

  def render_unauthorized_unless_signed_in!
    head :unauthorized if current_user_uuid.nil?
  end

  def render_unauthorized_unless_admin!
    head :unauthorized unless current_user_authorized_as_admin?
  end

  def current_user_is_admin?
    unless Utilities.real_production_deployment?
      configured_admin_uuids = Rails.application.secrets.admin_uuids&.split(',')&.map(&:strip) || []
      return true if configured_admin_uuids.include?(current_user_uuid)
    end

    Admin.where(user_id: current_user_uuid).any?
  end
end
