# frozen_string_literal: true

class ApplicationController < ActionController::API
  def error_404
    render json: 'Bad Request', status: 404
  end

  def current_researcher
    raise 'nyi'
  end

  protected

  include RescueFromUnlessLocal

  def current_user_uuid
    @current_user_uuid ||= begin
      if Rails.application.load_testing? && request.headers['HTTP_LOADTEST_CLIENT_UUID']
        return request.headers['HTTP_LOADTEST_CLIENT_UUID']
      end

      if Rails.env.development? && ENV['STUBBED_USER_UUID']
        ENV['STUBBED_USER_UUID']
      else
        if ENV['STUBBED_USER_UUID']
          Rails.logger.warn("`STUBBED_USER_UUID` environment variable is set but not used in " \
                            "the #{Rails.env} environment.")
        end

        OpenStax::Auth::Strategy2.user_uuid(request)
      end
    end
  end

  def render_unauthorized_if_no_current_user
    head :unauthorized if current_user_uuid.nil?
  end
end
