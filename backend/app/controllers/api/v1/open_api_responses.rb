# frozen_string_literal: true

module Api::V1::OpenApiResponses
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :ServerError do
      property :status_code do
        key :type, :integer
        key :description, 'The HTTP status code'
      end
      property :messages do
        key :type, :array
        key :description, 'The error messages, if any'
        items do
          key :type, :string
        end
      end
    end

  end

  module AuthenticationError
    def self.extended(base)
      base.response 401 do
        key :description, 'Not authenticated.  The user is not authenticated.'
      end
    end
  end

  module ForbiddenError
    def self.extended(base)
      base.response 403 do
        key :description, 'Forbidden.  The user is not allowed to perform the requested action.'
      end
    end
  end

  module NotFoundError
    def self.extended(base)
      base.response 404 do
        key :description, 'Not found'
      end
    end
  end

  module UnprocessableEntityError
    def self.extended(base)
      base.response 422 do
        key :description, 'Could not process request'
        content 'application/json' do
          schema do
            key :$ref, :ServerError
          end
        end
      end
    end
  end

  module NotAcceptableError
    def self.extended(base)
      base.response 406 do
        key :description, 'Not acceptable.  Invalid input data was detected'
        content 'application/json' do
          key :$ref, :ServerError
        end
      end
    end
  end

  module ServerError
    def self.extended(base)
      base.response 500 do
        key :description, 'Server error.'
        content 'application/json' do
          schema do
            key :$ref, :ServerError
          end
        end
      end
    end
  end
end
