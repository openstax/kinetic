# frozen_string_literal: true

class Api::V1::ResearchersOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :ResearcherUpdate
    schema :Researcher
    schema :ResearchersList do
      property :data do
        key :type, :array
        key :description, 'The researchers.'
        items do
          key :$ref, :Researcher
        end
      end
    end
  end

  add_properties(:ResearcherUpdate, :Researcher) do
    property :id do
      key :type, :integer
      key :description, 'The researcher\'s ID.'
    end
  end

  add_properties(:Researcher) do
    property :user_id do
      key :type, :string
      key :format, 'uuid'
      key :description, 'The researcher\'s user ID.'
    end
  end

  add_properties(:Researcher, :ResearcherUpdate) do
    property :name do
      key :type, :string
      key :description, 'The researcher\'s name.'
    end
    property :institution do
      key :type, :string
      key :description, 'The researcher\'s institution.'
    end
    property :bio do
      key :type, :string
      key :description, 'The researcher\'s bio.'
    end
    property :lab_page do
      key :type, :string
      key :description, 'The researcher\'s lab page.'
    end
    property :research_interest_1 do
      key :type, :string
      key :description, 'The researcher\'s interest (1).'
    end
    property :research_interest_2 do
      key :type, :string
      key :description, 'The researcher\'s interest (2).'
    end
    property :research_interest_3 do
      key :type, :string
      key :description, 'The researcher\'s interest (3).'
    end
    property :invite_code do
      key :type, :string
      key :description, 'The researcher\'s invite code.'
    end
  end

  openapi_path '/researchers' do
    # operation :post do
    #   key :summary, 'Add a researcher'
    #   key :operationId, 'createResearcher'
    #   request_body do
    #     key :description, 'The researcher data'
    #     key :required, true
    #     content 'application/json' do
    #       schema do
    #         key :type, :object
    #         key :title, :addResearcher
    #         property :researcher do
    #           key :required, true
    #           key :$ref, :Researcher
    #         end
    #       end
    #     end
    #   end
    #   response 201 do
    #     key :description, 'Created.  Returns the created researcher.'
    #     content 'application/json' do
    #       schema { key :$ref, :Researcher }
    #     end
    #   end
    #   extend Api::V1::OpenApiResponses::AuthenticationError
    #   extend Api::V1::OpenApiResponses::ForbiddenError
    #   extend Api::V1::OpenApiResponses::UnprocessableEntityError
    #   extend Api::V1::OpenApiResponses::ServerError
    # end

    operation :get do
      key :summary, 'Retrieve list of all researchers'
      key :description, 'Returns listing of all researchers'
      key :operationId, 'getResearchers'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :ResearchersList }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researchers/{id}' do
    operation :put do
      key :summary, 'Update a researcher'
      key :operationId, 'updateResearcher'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the researcher to delete.'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The researcher data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateResearcher
            property :researcher do
              key :required, true
              key :$ref, :Researcher
            end
          end
        end
      end
      response 201 do
        key :description, 'Updated.  Returns the researcher.'
        content 'application/json' do
          schema { key :$ref, :Researcher }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :delete do
      key :summary, 'Remove a researcher'
      key :operationId, 'deleteResearcher'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the researcher to delete.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :get do
      key :summary, 'Get researcher'
      key :description, 'Get a researcher by an ID'
      key :operationId, 'getResearcher'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the researcher to get.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success. Returns the researcher.'
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
end
