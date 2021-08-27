# frozen_string_literal: true

class Api::V0::MiscController < Api::V0::BaseController

  def whoami
    render status: :ok, json: Api::V0::Bindings::Whoami.new(
      user_id: current_user_uuid,
      is_administrator: Admin.where(user_id: current_user_uuid).any?,
      is_researcher: Researcher.where(user_id: current_user_uuid).any?
    )
  end

  def environment
    render status: :ok, json: Api::V0::Bindings::Environment.new(
      accounts_env_name: Rails.application.secrets.accounts[:env_name]
    )
  end

end
