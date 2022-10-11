# frozen_string_literal: true

class StaticController < ActionController::Base

  def catchall
    redirect_to local_dev_path_for_request and return unless Rails.env.production?

    if has_auth_cookie?
      render file: 'public/index.html'
    else
      # see other is treated as signal that target should be canonical
      # https://developers.google.com/search/docs/crawling-indexing/301-redirects
      redirect_to Rails.application.secrets.homepage_url, status: :see_other
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

  protected

  include CookieAuthentication

  def local_dev_path_for_request
    Rails.application.secrets.frontend_url + request.fullpath
  end
end
