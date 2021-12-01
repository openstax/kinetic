# frozen_string_literal: true

class Api::V0::EligibilityController < Api::V0::BaseController

  def index
    country = request.headers['CloudFront-Viewer-Country-Name']
    book = params[:book_slug]

    render status: :ok, json: {
      eligible: (
        (country.blank? || Kinetic::ELIGIBLE_COUNTRY_CODES.include?(country)) &&
          (book.blank? || !Kinetic::NON_ELIGIBLE_BOOKS.include?(book))
      )
    }
  end
end
