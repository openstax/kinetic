# frozen_string_literal: true

class Api::V0::Researcher::StudyResearchersSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  swagger_schema :Researcher do
    key :required, [:user_id]
    property :user_id do
      key :type, :string
      key :format, 'uuid'
      key :description, 'The researcher\'s user ID.'
    end
    property :first_name do
      key :type, :string
      key :description, 'The researcher\'s first name.'
    end
    property :last_name do
      key :type, :string
      key :description, 'The researcher\'s last name.'
    end
  end

  swagger_path '/research/studies/{study_id}/researcher/{user_id}' do
    operation :post do
      key :summary, 'Add a researcher to a study'
      key :description, 'Add a researcher to a study'
      key :operationId, 'addResearcherToStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :study_id
        key :in, :path
        key :description, 'ID of the study.'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :user_id
        key :in, :path
        key :description, 'UUID of the user to add as a researcher'
        key :required, true
        key :type, :string
        key :format, 'uuid'
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/studies/{study_id}/researcher/{user_id}' do
    operation :delete do
      key :summary, 'Remove a researcher from a study'
      key :description, 'Remove a researcher from a study.  Cannot remove the last researcher.'
      key :operationId, 'removeResearcherFromStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :study_id
        key :in, :path
        key :description, 'ID of the study.'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :user_id
        key :in, :path
        key :description, 'UUID of the user to remove as a researcher'
        key :required, true
        key :type, :string
        key :format, 'uuid'
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end
end
