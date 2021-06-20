# frozen_string_literal: true

class Api::V0::Researcher::StudiesController < Api::V0::Researcher::BaseController

  def create
    inbound_binding, error = bind(params.require(:study), Api::V0::Bindings::NewStudy)
    render(json: error, status: error.status_code) and return if error

    created_study = inbound_binding.create_model!(researcher: current_researcher)

    response_binding = Api::V0::Bindings::Study.create_from_model(created_study)
    render json: response_binding, status: :created
  end

  def index
    studies = current_researcher.studies
    response_binding = Api::V0::Bindings::Researcher::Studies.new(
      data: studies.map do |study|
              Api::V0::Bindings::Researcher::Study.create_from_model(study)
            end
    )
    render json: response_binding, status: :ok
  end

  # def update
  #   inbound_binding, error = bind(params.require(:highlight), Api::V0::Bindings::HighlightUpdate)
  #   render(json: error, status: error.status_code) and return if error

  #   updated_highlight = service_limits.with_update_protection do
  #     inbound_binding.update_model!(@highlight)
  #   end
  #   response_binding = Api::V0::Bindings::Highlight.create_from_model(updated_highlight)
  #   render json: response_binding, status: :ok
  # end

  # def destroy
  #   with_advisory_lock(@highlight) do
  #     @highlight.reload #need a reload here to make sure the highlight has current next/prev
  #     service_limits.with_delete_tracking do
  #       @highlight.destroy!
  #     end
  #   end
  #   head :ok
  # end

  # def show
  #   response_binding = Api::V0::Bindings::Highlight.create_without_user_data(@highlight)
  #   render json: response_binding, status: :ok
  # end

  # private

  # def with_advisory_lock(something_with_source_id)
  #   Highlight.with_advisory_lock("#{current_user_uuid}#{something_with_source_id.source_id&.downcase&.strip}") do
  #     yield
  #   end
  # end

  # def service_limits
  #   ServiceLimits.new(user_id: current_user_uuid)
  # end

  # def set_highlight
  #   @highlight = Highlight.find(params[:id])
  # end

  # def validate_highlight_belongs_to_requesting_user
  #   raise SecurityTransgression unless @highlight.user_id == current_user_uuid
  # end

  # def query_parameters
  #   request.query_parameters.tap do |parameters|
  #     # Swagger-codegen clients can't make the x[]=entry1&x[]=entry2 query parameter array
  #     # syntax, which means we have to use an alternate serialization of an array.  For
  #     # source_ids and colors we use CSV; here we do the comma splitting.
  #     parameters["source_ids"] = parameters["source_ids"].split(',') if parameters["source_ids"].is_a?(String)
  #     parameters["colors"] = parameters["colors"].split(',') if parameters["colors"].is_a?(String)
  #     parameters["sets"] = parameters["sets"].split(',') if parameters["sets"].is_a?(String)
  #   end
  # end
end
