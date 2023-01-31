# frozen_string_literal: true

class Api::V1::Researcher::StudyResearchersOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :Researcher do
      key :required, [:user_id]
      property :id do
        key :type, :integer
        key :description, 'The researcher\'s ID.'
      end
      property :user_id do
        key :type, :string
        key :format, 'uuid'
        key :description, 'The researcher\'s user ID.'
      end
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
    end
  end

  openapi_path '/researcher/studies/{study_id}/researcher/{user_id}' do
    operation :post do
      key :summary, 'Add a researcher to a study'
      key :description, 'Add a researcher to a study'
      key :operationId, 'addResearcherToStudy'
      parameter do
        key :name, :study_id
        key :in, :path
        key :description, 'ID of the study.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :user_id
        key :in, :path
        key :description, 'UUID of the user to add as a researcher'
        key :required, true
        key :schema, { type: :string, format: 'uuid' }
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/studies/{study_id}/researcher/{user_id}' do
    operation :delete do
      key :summary, 'Remove a researcher from a study'
      key :description, 'Remove a researcher from a study.  Cannot remove the last researcher.'
      key :operationId, 'removeResearcherFromStudy'
      parameter do
        key :name, :study_id
        key :in, :path
        key :description, 'ID of the study.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :user_id
        key :in, :path
        key :description, 'UUID of the user to remove as a researcher'
        key :required, true
        key :schema, { type: :string, format: 'uuid' }
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
