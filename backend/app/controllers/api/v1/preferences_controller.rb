# frozen_string_literal: true

class Api::V1::PreferencesController < Api::V1::BaseController

  before_action :render_unauthorized_unless_signed_in!

  def index
    prefs = UserPreferences.find_by(user_id: current_user_uuid) || UserPreferences.new
    render json: Api::V1::Bindings::UserPreferences.create_from_model(prefs), status: :ok
  end

  def create
    inbound_binding, error = bind(params.require(:preferences), Api::V1::Bindings::UserPreferences)
    render(json: error, status: error.status_code) and return if error

    prefs = UserPreferences.for_user_id(current_user_uuid)
    prefs.update(inbound_binding.to_hash)

    response_binding = Api::V1::Bindings::UserPreferences.create_from_model(prefs)
    render json: response_binding, status: :accepted
  end
end
