# frozen_string_literal: true

class Api::V1::Admin::MasqueradeController < Api::V1::Admin::BaseController
  def masquerade_as_researcher
    researcher = Researcher.find(params[:id])
    session[:masquerading] = researcher.user_id
    cookies[:masquerading] = researcher.user_id
    render json: researcher, status: :ok
  end

  def stop
    cookies.delete :masquerading
    render json: { message: 'success' }, status: :ok
  end
end
