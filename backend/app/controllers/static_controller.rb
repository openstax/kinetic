# frozen_string_literal: true

class StaticController < ActionController::Base
  def catchall
    if Rails.env.production?
      render file: 'public/index.html'
    else
      redirect_to Rails.application.secrets.frontend_url + request.fullpath
    end
  end

  def error404
    respond_to do |format|
      format.json do
        render json: { message: 'bad request', error: true }, status: 404
      end
      format.any do
        render text: 'bad request, content not found', status: 404
      end
    end
  end
end
