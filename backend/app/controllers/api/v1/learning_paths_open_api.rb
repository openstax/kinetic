# frozen_string_literal: true

class Api::V1::LearningPathsOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :LearningPath do
      key :required, [:label, :description]

      property :id do
        key :type, :number
        key :description, 'The learning path ID'
      end
      property :order do
        key :type, :number
        key :description, 'The learning path rendering order'
      end
      property :label do
        key :type, :string
        key :description, 'Learning path label'
      end
      property :description do
        key :type, :string
        key :description, 'Learning path description'
      end
      property :level_1_metadata do
        key :type, :array
        key :minLength, 0
        key :items, { 'type' => 'string' }
        key :description, 'Level 1 metadata'
      end
      property :level_2_metadata do
        key :type, :array
        key :minLength, 0
        key :items, { 'type' => 'string' }
        key :description, 'Level 2 metadata'
      end
      property :badge_id do
        key :type, :string
        key :description, 'Open badge factory badge_id value'
      end
      property :badge do
        key :$ref, :Badge
        key :description, 'Open badge factory badge'
      end
      property :completed do
        key :type, :boolean
        key :description, 'Has the user completed this learning path?'
      end
      property :studies do
        key :type, :array
        key :description, 'Studies with this learning path'
        items do
          key :$ref, :Study
        end
      end
    end

    schema :Badge do
      property :id do
        key :type, :string
        key :description, 'Badge ID'
        key :readOnly, true
      end
      property :name do
        key :type, :string
        key :description, 'Badge name'
        key :readOnly, true
      end
      property :description do
        key :type, :string
        key :description, 'Badge description'
        key :readOnly, true
      end
      property :image do
        key :type, :string
        key :description, 'Badge image'
        key :readOnly, true
      end
      property :tags do
        key :type, :array
        key :description, 'Badge tags'
        key :items, { 'type' => 'string' }
      end
    end

    schema :LearningPaths do
      key :required, %w[data]
      property :data do
        key :type, :array
        key :description, 'The learning paths.'
        items do
          key :$ref, :LearningPath
        end
      end
    end
  end

  openapi_path '/admin/learning_paths' do
    operation :post do
      key :summary, 'Add a learning path'
      key :operationId, 'createLearningPath'
      request_body do
        key :description, 'The learning path data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :addLearningPath
            property :learning_path do
              key :required, true
              key :$ref, :LearningPath
            end
          end
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created learning path.'
        content 'application/json' do
          schema { key :$ref, :LearningPath }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :get do
      key :summary, 'Retrieve all learning paths'
      key :description, 'Returns all learning paths'
      key :operationId, 'getLearningPaths'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :LearningPaths }
        end

      end
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/learning_paths/{id}' do
    operation :put do
      key :summary, 'Update a learning path'
      key :operationId, 'updateLearningPath'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the learning path to update.'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The learning path data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateLearningPath
            property :learning_path do
              key :required, true
              key :$ref, :LearningPath
            end
          end
        end
      end
      response 201 do
        key :description, 'Updated.  Returns the learning path.'
        content 'application/json' do
          schema { key :$ref, :LearningPath }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :delete do
      key :summary, 'Remove a learningPath'
      key :operationId, 'deleteLearningPath'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the learning path to delete.'
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
