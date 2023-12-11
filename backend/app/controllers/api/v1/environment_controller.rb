# frozen_string_literal: true

class Api::V1::EnvironmentController < Api::V1::BaseController
  def index
    country = request.headers['CloudFront-Viewer-Country']
    researcher = Researcher.find_by(user_id: current_user_uuid)
    render status: :ok, json: Api::V1::Bindings::Environment.new(
      user: {
        user_id: current_user_uuid,
        is_administrator: Admin.where(user_id: current_user_uuid).any?,
        is_researcher: !researcher.nil?
      },
      researcher: researcher ? Api::V1::Bindings::Researcher.create_from_model(researcher) : nil,
      accounts_env_name: Rails.application.secrets.accounts[:env_name],
      homepage_url: Rails.application.secrets.homepage_url,
      banners_schedule: Banner.active.to_a || [],
      rewards_schedule: Reward.all.to_a,
      is_impersonating: session[:impersonating].present?,
      is_country_eligible: country.blank? || Kinetic::ELIGIBLE_COUNTRY_CODES.include?(country)
    )
  end
end
