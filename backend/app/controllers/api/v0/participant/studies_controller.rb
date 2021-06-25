# frozen_string_literal: true

class Api::V0::Participant::StudiesController < Api::V0::BaseController
  before_action :render_unauthorized_if_no_current_user

  def index
    # studies = current_user.studies
    # response_binding = Api::V0::Bindings::Participant::Studies.new(
    #   data: studies.map do |study|
    #           Api::V0::Bindings::Participant::Study.create_from_model(study)
    #         end
    # )
    # render json: response_binding, status: :ok
  end

  def show

  end

end
