# frozen_string_literal: true

class Api::V1::DiagnosticsController < Api::V1::BaseController
  before_action :validate_not_real_production

  # Forcing an exception
  def exception
    raise 'An exception for diagnostic purposes'
  end

  # Forcing a status code response
  def status_code
    head params[:status_code]
  end

  # Showing whether Accounts integration is working
  def me
    render json: { uuid: current_user_uuid }
  end

end
