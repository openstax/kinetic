# frozen_string_literal: true

class Api::V1::BadgeCertificateOpenApi
  include OpenStax::OpenApi::Blocks
  
    openapi_component do
      schema :BadgeCertificateResponse do
        property :pdf do
          key :type, :string
          key :description, 'Base64-encoded PDF data'
        end
      end
    end
  
    openapi_path '/badge_certificate' do
      operation :get do
        key :summary, 'Retrieve a PDF link for a badge'
        key :description, 'Fetches a PDF link associated with a badge for a given email'
        key :operationId, 'getBadgeCertificate'

        parameter name: :badge_id, in: :query, required: true do
          schema do
            key :type, :string
            key :description, 'Badge ID'
          end
        end
    
        parameter name: :email, in: :query, required: true do
          schema do
            key :type, :string
            key :description, 'Recipient Email'
          end
        end
  
        response 200 do
          key :description, 'PDF link retrieved successfully.'
          content 'application/json' do
            schema { key :$ref, :BadgeCertificateResponse }
          end
        end
        response 404 do
          key :description, 'Badge or PDF link not found.'
        end
        extend Api::V1::OpenApiResponses::ServerError
      end
    end
  end
  