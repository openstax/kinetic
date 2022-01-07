# frozen_string_literal: true

class Api::V1::MiscController < Api::V1::BaseController

  REWARDS_SCHEDULE = YAML.load_file(Rails.root.join('config', 'rewards_schedule.yml'))

  def whoami
    render status: :ok, json: Api::V1::Bindings::Whoami.new(
      user_id: current_user_uuid,
      is_administrator: Admin.where(user_id: current_user_uuid).any?,
      is_researcher: Researcher.where(user_id: current_user_uuid).any?
    )
  end

  def environment
    render status: :ok, json: Api::V1::Bindings::Environment.new(
      accounts_env_name: Rails.application.secrets.accounts[:env_name],
      homepage_url: Rails.application.secrets.homepage_url,
      rewards_schedule: REWARDS_SCHEDULE
    )
  end
end
