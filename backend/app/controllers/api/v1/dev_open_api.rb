# frozen_string_literal: true

class Api::V1::DevOpenApi
  include OpenStax::OpenApi::Blocks
  openapi_component do

    schema :DevUser do
      property :user_id do
        key :type, :integer
        key :description, 'UUID of the user'
      end
      property :first_name do
        key :type, :string
        key :description, 'Users first name'
      end
      property :last_name do
        key :type, :string
        key :description, 'Users last name'
      end
      property :name do
        key :type, :string
        key :description, 'Users full name'
      end
      property :is_researcher do
        key :type, :boolean
        key :description, 'Is the user a researcher'
      end
      property :is_admin do
        key :type, :boolean
        key :description, 'Is the user an administrator'
      end
    end

    schema :DevUsers do
      property :researchers do
        key :type, :array
        key :description, 'The researchers.'
        items do
          key :$ref, :DevUser
        end
      end

      property :admins do
        key :type, :array
        key :description, 'The admins.'
        items do
          key :$ref, :DevUser
        end
      end

      property :users do
        key :type, :array
        key :description, 'The users.'
        items do
          key :$ref, :DevUser
        end
      end
    end
  end

  openapi_path '/development/users' do
    operation :get do
      key :summary, 'Get all development users'
      key :description, <<~DESC
        Returns all users for development environment
      DESC
      key :operationId, 'fetchDevelopmentUsers'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :DevUsers }
        end
      end
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
