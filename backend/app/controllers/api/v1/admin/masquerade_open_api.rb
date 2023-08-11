# frozen_string_literal: true

class Api::V1::Admin::MasqueradeOpenApi
  include OpenStax::OpenApi::Blocks
  openapi_path '/admin/masquerade/researcher/{id}' do
    operation :post do
      key :summary, 'Masquerade as a researcher'
      key :operationId, 'masqueradeAsResearcher'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the researcher to masquerade as.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success. Returns researcher being impersonated as.'
        content 'application/json' do
          schema { key :$ref, :Researcher }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/masquerade/stop' do
    operation :post do
      key :summary, 'Stop masquerading'
      key :operationId, 'stopMasquerading'

      response 200 do
        key :description, 'Success. Stops masquerading.'
        # TODO What?
        # content 'application/json' do
        #   schema { key :$ref, :object }
        # end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
