# frozen_string_literal: true

class Api::V1::Researcher::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  COMMON_REQUIRED_STUDY_FIELDS = [
    :title_for_researchers,
    :internal_description
  ].freeze

  openapi_component do
    schema :Study do
      key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
      allOf do
        schema do
          key :$ref, :BaseStudy
        end
      end
    end

    schema :NewStudy do
      key :required, COMMON_REQUIRED_STUDY_FIELDS
      allOf do
        schema do
          key :$ref, :BaseStudy
        end
      end
    end

    schema :StudyUpdate do
      allOf do
        schema do
          key :$ref, :BaseStudy
        end
      end
    end

    schema :Studies do
      property :data do
        key :type, :array
        key :description, 'The studies.'
        items do
          key :$ref, :Study
        end
      end
    end
  end

  add_properties(:Study, :StudyUpdate) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
      key :readOnly, true
    end
  end

  openapi_path '/researcher/studies' do
    operation :post do
      key :summary, 'Add a study'
      key :description, 'Add a study'
      key :operationId, 'addStudy'
      request_body do
        key :description, 'The study data'
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :addStudy
            property :study do
              key :required, true
              key :$ref, :NewStudy
            end
          end
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created study.'
        content 'application/json' do
          schema do
            key :title, 'data'
            key :required, true
            key :$ref, :Study
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/studies' do
    operation :get do
      key :summary, 'Get studies for the calling researcher'
      key :description, <<~DESC
        Get studies for the calling researcher.
      DESC
      key :operationId, 'getStudies'
      response 200 do
        key :description, 'Success.  Returns the studies.'
        content 'application/json' do
          schema { key :$ref, :Studies }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/studies/{id}/update_status' do
    operation :post do
      key :summary, 'Updates the status of a study'
      key :description, 'Updates the status of a study'
      key :operationId, 'updateStudyStatus'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to update.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :status_action
        key :in, :query
        key :description, 'Action you want to take on the study'
        key :required, true
        key :schema, { type: :string, enum: %w[submit launch] }
      end
      request_body do
        key :description, 'The study updates.'
        key :required, false
        content 'application/json' do
          schema { key :$ref, :Study }
        end
      end
      response 200 do
        key :description, 'Success. Returns the updated study.'
        content 'application/json' do
          schema do
            key :$ref, :Study
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/studies/{id}' do
    operation :get do
      key :summary, 'Get a single study'
      key :description, 'Get a single study'
      key :operationId, 'getStudy'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to get.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success, Returns the study'
        content 'application/json' do
          schema { key :$ref, :Study }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :put do
      key :summary, 'Update a study'
      key :description, 'Update a study'
      key :operationId, 'updateStudy'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to update.'
        key :required, true
        key :schema, { type: :integer }
      end
      # parameter do
      #   key :name, :action
      #   key :in, :query
      #   key :description, 'Action you want to take on the study'
      #   key :required, false
      #   key :schema, { type: :string, enum: %w[submit launch] }
      # end
      request_body do
        key :description, 'The study updates.'
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateStudy
            property :study do
              key :$ref, :StudyUpdate
            end
          end
        end
      end
      response 200 do
        key :description, 'Success.  Returns the updated study.'
        content 'application/json' do
          schema do
            key :$ref, :Study
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/studies/{study_id}' do
    operation :delete do
      key :summary, 'Deletes an unlaunched study'
      key :description, 'Remove a study.  Cannot remove a study that has `first_lauched_at` set.'
      key :operationId, 'deleteStudy'
      parameter do
        key :name, :study_id
        key :in, :path
        key :description, 'ID of the study.'
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
