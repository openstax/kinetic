# frozen_string_literal: true

class StaticController < ActionController::Base

  def catchall
    redirect_to local_dev_path_for_request and return unless Rails.env.production?
    render file: 'public/app-root.html' and return if has_auth_cookie?

    # see other is treated as signal that target should be canonical
    # https://developers.google.com/search/docs/crawling-indexing/301-redirects
    redirect_to Rails.application.credentials.homepage_url, status: :see_other
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
    Rails.application.credentials.frontend_url + request.fullpath
  end
end
