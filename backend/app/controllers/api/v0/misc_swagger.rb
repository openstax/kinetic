# frozen_string_literal: true

class Api::V0::MiscSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  swagger_schema :Whoami do
    key :required, %w[is_researcher is_administrator]
    property :user_id do
      key :type, :string
      key :format, 'uuid'
      key :description, 'The user\'s ID.'
      key :readOnly, true
    end
    property :is_administrator do
      key :type, :boolean
      key :description, 'If true, the user is an administrator'
      key :readOnly, true
    end
    property :is_researcher do
      key :type, :boolean
      key :description, 'If true, the user is a researcher'
      key :readOnly, true
    end
  end

  swagger_schema :Environment do
    property :accounts_env_name do
      key :type, :string
      key :readOnly, true
    end
  end

  swagger_path '/whoami' do
    operation :get do
      key :summary, 'Get info about the current user'
      key :description, <<~DESC
        Get info about the current user
      DESC
      key :operationId, 'getWhoami'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Misc'
      ]
      response 200 do
        key :description, 'Success.'
        schema do
          key :'$ref', :Whoami
        end
      end
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/environment' do
    operation :get do
      key :summary, 'Get info about the deployment environment'
      key :description, <<~DESC
        Get info about the deployment environment
      DESC
      key :operationId, 'getEnvironment'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Misc'
      ]
      response 200 do
        key :description, 'Success.'
        schema do
          key :'$ref', :Environment
        end
      end
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

end
