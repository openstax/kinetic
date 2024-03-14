# frozen_string_literal: true

class Api::V1::EnvironmentController < Api::V1::BaseController
  def index
    researcher = Researcher.find_by(user_id: current_user_uuid)
    render status: :ok, json: Api::V1::Bindings::Environment.new(
      user: UserInfo.for_uuid(current_user_uuid),
      researcher: researcher ? Api::V1::Bindings::Researcher.create_from_model(researcher) : nil,
      accounts_env_name: Rails.application.credentials.dig(:accounts, :env_name),
      homepage_url: Rails.application.credentials.homepage_url,
      banners_schedule: Banner.active.to_a || [],
      rewards_schedule: Reward.all.to_a,
      is_impersonating: session[:impersonating].present?,
      is_eligible: Eligibility.is_country_eligible?(request.headers['CloudFront-Viewer-Country'])
    )
  end
end
