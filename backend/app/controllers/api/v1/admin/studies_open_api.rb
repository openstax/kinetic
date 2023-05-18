# frozen_string_literal: true

class Api::V1::Admin::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_path '/admin/studies' do
    operation :get do
      key :summary, 'Retrieve all studies waiting for approval'
      key :description, <<~DESC
        Returns listing of all studies waiting for approval
      DESC
      key :operationId, 'getStudiesAwaitingApproval'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :Studies }
        end

      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/studies/{id}/approve' do
    operation :post do
      key :summary, 'Approve a study'
      key :operationId, 'approveStudy'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to approve.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, <<~DESC
          Study approved. Returns the new list of studies waiting for approval.
        DESC
        content 'application/json' do
          schema { key :$ref, :Studies }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
