# frozen_string_literal: true

require 'openstax/auth/strategy_2'

class ApplicationController < ActionController::API
  include ActionController::Cookies if Kinetic.allow_stubbed_authentication?

  protected

  include RescueFromUnlessLocal
  include CookieAuthentication

  def validate_not_real_production
    head :unauthorized if Utilities.real_production_deployment?
  end

end
