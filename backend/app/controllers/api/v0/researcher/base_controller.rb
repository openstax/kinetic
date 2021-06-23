# frozen_string_literal: true

class Api::V0::Researcher::BaseController < Api::V0::BaseController
  before_action :render_unauthorized_unless_signed_in!
  before_action :render_forbidden_unless_researcher!

  protected

  def render_forbidden_unless_researcher!
    head :forbidden unless current_researcher
  end

  def current_researcher
    @current_researcher ||= current_user_uuid ? Researcher.find_by(user_id: current_user_uuid) : nil
  end
end
