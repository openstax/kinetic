# frozen_string_literal: true

# Define an empty class for production so that the autoloader does not complain
class Development::UsersController < ApplicationController; end

return unless Labs.allow_stubbed_authentication?

class Development::UsersController < ApplicationController
  before_action :validate_not_real_production # belt and suspenders

  include ActionController::Cookies

  def log_in
    if params[:user_id] =~ /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i
      cookies[:stubbed_user_uuid] = params[:user_id]
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def index
    users = {}
    Researcher.all.each do |researcher|
      users[:researchers] ||= []
      users[:researchers].push(researcher.slice('user_id', 'name'))
    end

    Admin.all.each do |admin|
      users[:admins] ||= []
      users[:admins].push({ user_id: admin.user_id, name: 'admin' })
    end

    render json: users, status: :ok
  end

  def ensure_users_exist
    Admin.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000000')
    Researcher.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000001')
    head :ok
  end
end
