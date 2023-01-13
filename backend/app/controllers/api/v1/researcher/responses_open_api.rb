# frozen_string_literal: true

class Api::V1::Researcher::ResponsesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :Responses do
      key :required, [:id, :status]

      property :status do
        key :type, :string
        key :description, 'Status of the request'
        key :enum, %w[pending complete error]
      end

      property :response_urls do
        key :type, :array
        key :description, 'URL(s) to download study responses from'
        key :items, { 'type' => 'string' }
      end

      property :error do
        key :type, :string
        key :description, 'The reason for the request failure'
      end
    end
  end

  openapi_path '/researcher/responses/{api_key}/status' do
    operation :get do
      key :summary, 'Retrives the status of response download'
      key :operationId, 'getResponseStatus'
      parameter do
        key :name, :api_key
        key :in, :path
        key :description, 'Api key of the analysis.'
        key :required, true
        key :schema, { type: :string }
      end
      response 200 do
        key :description, 'Success.  Returns the status of analysis response export.'
        content 'application/json' do
          schema do
            key :$ref, :Responses
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/responses/{api_key}/fetch' do
    operation :post do
      key :summary, 'Prepare response download'
      key :operationId, 'getResponseDownload'
      parameter do
        key :name, :api_key
        key :in, :path
        key :description, 'Api key of the analysis.'
        key :required, true
        key :schema, { type: :string }
      end
      response 200 do
        key :description, 'Success.  Returns the status of analysis response export.'
        content 'application/json' do
          schema do
            key :$ref, :Responses
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
