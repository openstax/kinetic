# frozen_string_literal: true

class Api::V1::EligibilityController < Api::V1::BaseController

  around_action :exhaustive_request_logging

  def index
    country = request.headers['CloudFront-Viewer-Country-Name']
    book = params[:book]
    render status: :ok, json: {
      eligible: (
        (country.blank? || Kinetic::ELIGIBLE_COUNTRY_CODES.include?(country)) &&
          (book.blank? || !Kinetic::NON_ELIGIBLE_BOOKS.include?(book))
      )
    }
  end
end
