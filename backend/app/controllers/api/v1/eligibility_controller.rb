# frozen_string_literal: true

class Api::V1::EligibilityController < Api::V1::BaseController

  def index
    country = request.headers['CloudFront-Viewer-Country']
    book = params[:book]
    render status: :ok, json: {
      eligible: Eligibility.is_country_eligible?(country) && Eligibility.is_book_eligible?(book),
      country: country
    }
  end
end
