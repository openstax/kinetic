# frozen_string_literal: true

class Api::V1::Admin::RewardsOpenApi
  include OpenStax::OpenApi::Blocks
  openapi_component do

    schema :Reward do
      property :id do
        key :type, :number
        key :description, 'The Reward ID'
      end
      property :prize do
        key :type, :string
        key :description, 'The messsage to display.  Limited HTML is supported'
      end
      property :info_url do
        key :type, :string
        key :description, 'A link for more information about the reward'
      end
      property :points do
        key :type, :number
        key :description, 'How many points are required to be eligible for the reward'
      end
      property :start_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When the reward starts to be active'
      end
      property :end_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When the reward stops being active'
      end
    end
    schema :RewardsListing do
      key :required, %w[data]
      property :data do
        key :type, :array
        key :description, 'The rewards.'
        items do
          key :$ref, :Reward
        end
      end
    end

  end

  openapi_path '/admin/rewards' do
    operation :post do
      key :summary, 'Add a reward'
      key :operationId, 'createReward'
      request_body do
        key :description, 'The reward data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :addReward
            property :reward do
              key :required, true
              key :$ref, :Reward
            end
          end
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created reward.'
        content 'application/json' do
          schema { key :$ref, :Reward }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :get do
      key :summary, 'Retrive list of all rewards'
      key :description, <<~DESC
        Returns listing of all rewards, expired or not
      DESC
      key :operationId, 'getRewards'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :RewardsListing }
        end

      end
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/rewards/{id}' do
    operation :put do
      key :summary, 'Update a reward'
      key :operationId, 'updateReward'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the reward to delete.'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The reward data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateReward
            property :reward do
              key :required, true
              key :$ref, :Reward
            end
          end
        end
      end
      response 201 do
        key :description, 'Updated.  Returns the reward.'
        content 'application/json' do
          schema { key :$ref, :Reward }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :delete do
      key :summary, 'Remove a reward'
      key :operationId, 'deleteReward'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the reward to delete.'
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
  end
end
