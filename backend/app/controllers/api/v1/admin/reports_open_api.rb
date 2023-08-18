# frozen_string_literal: true

class Api::V1::Researcher::ReportsOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_path '/admin/reports/learner-activity' do
    operation :get do
      key :summary, 'Get learner activity report'
      key :operationId, 'getLearnerActivityReport'

      parameter do
        key :name, :months_ago
        key :in, :query
        key :description,
            'Number of months to include in report'
        key :required, false
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success. Returns the report CSV.'
        content 'text/csv' do
          schema do
            key :type, :string
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
