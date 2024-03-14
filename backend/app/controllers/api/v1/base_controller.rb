# frozen_string_literal: true

class Api::V1::BaseController < ApplicationController

  include ActionController::HttpAuthentication::Token::ControllerMethods
  include OpenStax::OpenApi::Blocks
  include OpenStax::OpenApi::Bind

  rescue_from_unless_local StandardError, send_to_sentry: true do |ex|
    raise if Rails.env.test? # we should never be expecting a 500 in a test

    render json: binding_error(status_code: 500, messages: [ex.message]), status: 500
  end

  rescue_from NotAuthorized do |_ex|
    head :unauthorized
  end

  rescue_from_unless_local ActiveRecord::RecordNotFound do |_ex|
    head :not_found
  end

  rescue_from_unless_local ActiveRecord::RecordInvalid,
                           ActionController::ParameterMissing,
                           LaunchError,
                           LandError do |ex|
    render json: binding_error(status_code: 422, messages: [ex.message]), status: 422
  end

  rescue_from_unless_local SecurityTransgression do |_ex|
    head :forbidden
  end

  protected

  def forbid_unless_enclave_api_key!
    head :forbidden unless has_enclaves_token?
  end

  def has_enclaves_token?
    authenticate_with_http_token do |token, _o|
      Rails.application.credentials.enclave_api_key == token
    end
  end

  def binding_error(status_code:, messages:)
    Api::V1::Bindings::ServerError.new(status_code:, messages:)
  end

  def exhaustive_request_logging
    puts '*' * 40
    pp request.method
    pp request.url
    pp request.remote_ip
    pp ActionController::HttpAuthentication::Token.token_and_options(request)

    request.headers.env.each_key do |key|
      value = request.headers[key]
      next unless value.is_a?(String) # don't dump things like "puma_config"

      puts format('%<key>20s : %<value>s', { key:, value: }).join(' ')
    end
    puts '-' * 40
    params.each_key do |key|
      puts format('%<key>20s : %<value>s', { key: key.to_s, value: params[key].inspect })
    end
    puts '*' * 40
    begin
      yield
    ensure
      puts response.body
    end
  end
end
