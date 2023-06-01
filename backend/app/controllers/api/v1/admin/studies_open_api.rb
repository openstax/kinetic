# frozen_string_literal: true

class Api::V1::Admin::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_path '/admin/studies/{status}' do
    operation :get do
      key :summary, 'Retrieve all studies with status'
      key :description, <<~DESC
        Returns listing of all studies with status approval,
      DESC
      key :operationId, 'adminQueryStudies'

      parameter do
        key :name, :status
        key :in, :path
        key :description,
            'fetch studies with the given status. "all" will return all studies'
        key :required, true
        key :schema, { type: :string, format: 'string', example: 'approved' }
      end

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

  openapi_path '/admin/stage/{stage_id}/responses' do
    operation :post do
      key :summary, 'add a response file'
      key :operationId, 'adminAddResponses'

      parameter do
        key :name, :stage_id
        key :in, :path
        key :description, 'id of stage'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The response data'
        key :required, true
        content 'multipart/form-data' do
          schema do
            property :is_testing do
              key :type, :boolean
              key :description, 'is test data, not real'
            end
            property :file do
              key :type, :string
              key :format, 'binary'
            end
          end
        end
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :ResponsesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/responses/{id}' do
    operation :delete do
      key :summary, 'remove a response file'
      key :operationId, 'adminDestroyResponse'

      parameter do
        key :name, :id
        key :in, :path
        key :description, 'id of response'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :ResponsesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/study/{id}/responses' do
    operation :get do
      key :summary, 'Retrieve all responses for study'
      key :description, <<~DESC
        Returns listing of all responses for a study
      DESC
      key :operationId, 'adminResponsesForStudy'

      parameter do
        key :name, :id
        key :in, :path
        key :description,
            'fetch responses for the study with the given id'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :ResponsesListing }
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
      key :operationId, 'adminApproveStudy'
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
