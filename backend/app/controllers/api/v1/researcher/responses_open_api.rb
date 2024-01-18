# frozen_string_literal: true

class Api::V1::Researcher::ResponsesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :Responses do
      key :required, [:id, :status]

      property :id do
        key :type, :integer
        key :description, 'The Responses download ID.'
        key :readOnly, true
      end

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

  openapi_path '/researcher/responses/{api_key}' do
    operation :get do
      key :summary, 'Prepare and fetch response download'
      key :operationId, 'getResponseDownload'
      parameter do
        key :name, :api_key
        key :in, :path
        key :description, 'Api key of the analysis.'
        key :required, true
        key :schema, { type: :string }
      end

      parameter do
        key :name, :cutoff
        key :in, :query
        key :description,
            'only fetch responses before given cutoff date, defaults to today if omitted'
        key :required, false
        key :schema, { type: :string, format: 'date', example: '2022-07-01' }
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

  openapi_path '/researcher/responses/{api_key}/info' do
    operation :get do
      key :summary, 'and fetch response info'
      key :operationId, 'getResponseInfo'
      parameter do
        key :name, :api_key
        key :in, :path
        key :description, 'Api key of the analysis.'
        key :required, true
        key :schema, { type: :string }
      end

      response 200 do
        key :description, 'Success.  Returns urls for information on the analysis response exports.'
        content 'application/json' do
          schema do
            key :type, :object
            property :info_urls do
              key :type, :array
              key :description, 'URLs to download the help information'
              key :items, { 'type' => 'string' }
            end
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
