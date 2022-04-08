# frozen_string_literal: true

class Api::V1::EnvironmentController < Api::V1::BaseController
  def index
    render status: :ok, json: Api::V1::Bindings::Environment.new(
      user: {
        user_id: current_user_uuid,
        is_administrator: Admin.where(user_id: current_user_uuid).any?,
        is_researcher: Researcher.where(user_id: current_user_uuid).any?
      },
      accounts_env_name: Rails.application.secrets.accounts[:env_name],
      homepage_url: Rails.application.secrets.homepage_url,
      banners_schedule: Banner.active.to_a || [],
      rewards_schedule: Reward.all.to_a,
    )
  end
end
