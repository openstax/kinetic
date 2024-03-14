# frozen_string_literal: true

class Api::V1::Admin::ImpersonateController < Api::V1::Admin::BaseController
  skip_before_action :render_unauthorized_unless_admin!, only: [:stop]
  def impersonate_researcher
    researcher = Researcher.find(params[:id])
    session[:impersonating] = researcher.user_id
    redirect_to(Rails.application.secrets.frontend_url, allow_other_host: true)
  end

  def stop
    session.delete :impersonating
    redirect_to("#{Rails.application.secrets.frontend_url}/admin/impersonate", allow_other_host: true)
  end
end
