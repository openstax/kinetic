# frozen_string_literal: true

return unless Rails.env.development? || Rails.env.test?

class Development::UsersController < ApplicationController
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
      users[:researchers].push({
                                 researcher.user_id => {
                                   name: researcher.name
                                 }
                               })
    end

    Admin.all.each do |admin|
      users[:admins] ||= []
      users[:admins].push(admin.user_id)
    end

    render json: users, status: :ok
  end

  def ensure_an_admin_exists
    Admin.find_or_create_by(user_id: '00000000-0000-0000-0000-000000000000')
    head :ok
  end

  def whoami
    render json: { user_id: current_user_uuid }, status: :ok
  end

end
