# frozen_string_literal: true

# Define an empty class for production so that the autoloader does not complain
class Development::UsersController < ApplicationController; end

return unless Kinetic.allow_stubbed_authentication?

class Development::UsersController < ApplicationController
  MOCK_USERS = [
    { user_id: '00000000-0000-0000-0000-000000000001', role: 'admin', name: 'Admin Uno' },
    { user_id: '00000000-0000-0000-0000-000000000001', role: 'researcher', name: 'Researcher Uno' },
    { user_id: '00000000-0000-0000-0000-000000000002', role: 'user', name: 'User Uno' },
    { user_id: '00000000-0000-0000-0000-000000000003', role: 'user', name: 'User Dos' },
    { user_id: '00000000-0000-0000-0000-000000000004', role: 'user', name: 'User Tres' },
    { user_id: '00000000-0000-0000-0000-000000000005', role: 'user', name: 'User Cuatro' }
  ].freeze

  before_action :validate_not_real_production # belt and suspenders

  include ActionController::Cookies

  def log_in
    if params[:user_id] =~ /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i
      uuid = params[:user_id]
      cookies[:stubbed_user_uuid] = uuid
      render status: :ok, json: Api::V1::Bindings::EnvironmentUser.new(
        user_id: uuid,
        is_administrator: Admin.where(user_id: uuid).any?,
        is_researcher: Researcher.where(user_id: uuid).any?
      )
    else
      head :unprocessable_entity
    end
  end

  def log_out
    cookies.delete :stubbed_user_uuid
    head :ok
  end

  def index
    users = {}
    Researcher.all.each do |researcher|
      users[:researchers] ||= []
      users[:researchers].push({
        user_id: researcher.user_id,
        first_name: researcher.first_name,
        last_name: researcher.last_name
      })
    end

    Admin.all.each do |admin|
      users[:admins] ||= []
      users[:admins].push({ user_id: admin.user_id, name: 'admin' })
    end
    users[:users] = MOCK_USERS.filter { |u| u[:role] == 'user' }
    render json: users, status: :ok
  end

  def ensure_users_exist
    Admin.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000000')
    Researcher.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000001')
    head :ok
  end

  def user_info
    user = MOCK_USERS.find { |u| u[:user_id] == current_user_uuid }
    if user.nil?
      head :not_found
      return
    end

    render json: {
      id: user[:user_id],
      full_name: user[:name],
      contact_infos: [{
        type: 'EmailAddress', value: "#{user[:name].parameterize}@test.openstax.org"
      }]
    }
  end
end
