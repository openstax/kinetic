# frozen_string_literal: true

class Api::V1::Admin::ImpersonateController < Api::V1::Admin::BaseController
  def impersonate_researcher
    researcher = Researcher.find(params[:id])
    session[:impersonating] = researcher.user_id
    render json: {
      message: 'success',
      impersonating: session[:impersonating]
    }, status: :ok
  end

  def stop
    session.delete :impersonating
    render json: { message: 'success' }, status: :ok
  end
end
