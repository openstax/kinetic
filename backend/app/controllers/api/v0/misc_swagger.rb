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
    property :accounts_env do
      key :type, :string
      key :readOnly, true
    end
  end
end
