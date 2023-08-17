# frozen_string_literal: true

# Define an empty class for production so that the autoloader does not complain
class Development::UsersController < ApplicationController; end

return unless Kinetic.allow_stubbed_authentication?

class Development::UsersController < ApplicationController
  MOCK_USERS = [
    { user_id: '00000000-0000-0000-0000-000000000000', role: 'admin', first_name: 'Admin',
      last_name: 'Uno', name: 'Admin Uno' },
    { user_id: '00000000-0000-0000-0000-000000000001', role: 'researcher', name: 'Researcher Uno',
      first_name: 'Researcher', last_name: 'Uno' },
    { user_id: '00000000-0000-0000-0000-000000000002', role: 'user', name: 'User Uno',
      first_name: 'User', last_name: 'Uno' },
    { user_id: '00000000-0000-0000-0000-000000000003', role: 'user', name: 'User Dos',
      first_name: 'User', last_name: 'Dos' },
    { user_id: '00000000-0000-0000-0000-000000000004', role: 'user', name: 'User Tres',
      first_name: 'User', last_name: 'Tres' },
    { user_id: '00000000-0000-0000-0000-000000000005', role: 'user', name: 'User Cuatro',
      first_name: 'User', last_name: 'Cuatro' }
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
    users[:researchers] ||= researchers
    users[:admins] ||= admins
    users[:users] = MOCK_USERS.filter { |u| u[:role] == 'user' }
    render json: users, status: :ok
  end

  def ensure_users_exist
    Admin.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000000')
    Researcher.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000001')
    head :ok
  end

  def user_info
    u = find_user

    if u.nil?
      head :not_found
      return
    end

    render json: {
      id: u[:user_id],
      full_name: u[:name],
      first_name: u[:first_name],
      last_name: u[:last_name],
      contact_infos: [{
        type: 'EmailAddress', value: "#{u[:name].parameterize}@test.openstax.org"
      }]
    }
  end

  protected

  def real_users
    users = []
    users.push(researchers)
    users.push(admins)
    users
  end

  def researchers
    Researcher.all.map do |researcher|
      {
        user_id: researcher.user_id,
        first_name: researcher.first_name,
        last_name: researcher.last_name,
        name: "#{researcher.first_name} #{researcher.last_name}",
        isResearcher: true,
        isAdmin: false
      }
    end
  end

  def admins
    Admin.all.map do |admin|
      {
        user_id: admin.user_id,
        first_name: 'Admin',
        last_name: 'McAdminFace',
        name: 'Admin McAdminFace',
        isAdmin: true,
        isResearcher: false
      }
    end
  end

  def find_user
    u = nil?
    mock_user = MOCK_USERS.find { |user| user[:user_id] == current_user_uuid }
    researcher = researchers.find { |r| r[:user_id] == current_user_uuid }
    admin = admins.find { |a| a[:user_id] == current_user_uuid }

    if mock_user
      u = mock_user
    elsif researcher
      u = researcher
    elsif admin
      u = admin
    end

    u
  end

end
