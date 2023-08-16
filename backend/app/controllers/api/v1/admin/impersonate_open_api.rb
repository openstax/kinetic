# frozen_string_literal: true

class Api::V1::Admin::ImpersonateOpenApi
  include OpenStax::OpenApi::Blocks
  openapi_path '/admin/impersonate/researcher/{id}' do
    operation :post do
      key :summary, 'Impersonate a researcher'
      key :operationId, 'impersonateResearcher'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the researcher to impersonate.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success.'
        # content 'application/json' do
        #   schema { key :$ref, :Researcher }
        # end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/impersonate/stop' do
    operation :post do
      key :summary, 'Stop impersonating'
      key :operationId, 'stopImpersonating'

      response 200 do
        key :description, 'Success. Stops impersonating.'
        # TODO: What?
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
