# frozen_string_literal: true

class StaticController < ActionController::Base
  def catchall
    render file: 'public/index.html'
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
