# frozen_string_literal: true

module CookieAuthentication
  def current_user_uuid
    return session[:impersonating] if session[:impersonating].present?

    @current_user_uuid ||=
      if Kinetic.allow_stubbed_authentication?
        if ENV['STUBBED_USER_UUID']
          ENV['STUBBED_USER_UUID']
        elsif cookies[:stubbed_user_uuid]
          cookies[:stubbed_user_uuid]
        end
      else
        OpenStax::Auth::Strategy2.user_uuid(request)
      end
  end

  def current_user
    @current_user ||= current_user_uuid ? User.new(current_user_uuid) : nil
  end

  def has_auth_cookie?
    current_user_uuid.present?
  end

  def render_unauthorized_unless_signed_in!
    head :unauthorized unless has_auth_cookie?
  end

  def render_unauthorized_unless_admin!
    head :unauthorized unless current_user_is_admin?
  end

  def current_user_is_admin?
    Admin.where(user_id: current_user_uuid).any?
  end
end
