class Api::V0::Researcher::BaseController < Api::V0::BaseController
  before_action :authenticate_researcher!, only: [:create]
end
