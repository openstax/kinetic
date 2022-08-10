# frozen_string_literal: true

class Api::V1::Researcher::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  COMMON_REQUIRED_STUDY_FIELDS = [
    :title_for_participants, :description_for_participants,
    :short_description, :tags
  ].freeze

  openapi_component do
    schema :Study do
      key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
    end

    schema :NewStudy do
      key :required, COMMON_REQUIRED_STUDY_FIELDS
    end

    schema :StudyUpdate

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

  add_properties(:Study, :NewStudy, :StudyUpdate) do
    property :title_for_participants do
      key :type, :string
      key :description, 'The study name that participants see.'
      key :minLength, 1
    end
    property :title_for_researchers do
      key :type, :string
      key :description, 'An study name that only researchers see.'
      key :minLength, 1
    end
    property :short_description do
      key :type, :string
      key :description, 'A short study description.'
    end
    property :long_description do
      key :type, :string
      key :description, 'A long study description.'
    end
    property :tags do
      key :type, :array
      key :minLength, 0
      key :items, { 'type' => 'string' }
      key :description, 'The tags of the study object, used for grouping and filtering.'
    end
    property :feedback_description do
      key :type, :string
      key :description, 'Description of the feedback that is displayed to the user upon study completion'
    end
    property :image_id do
      key :type, :string
      key :description, 'Freeform id of image that should be displayed on study card'
    end
    property :benefits do
      key :type, :string
      key :description, 'Description of how the study benefits participants'
    end
    property :duration_minutes do
      key :type, :integer
      key :description, 'The expected study duration in minutes.'
    end
    property :opens_at do
      key :type, :string
      key :nullable, true
      key :format, 'date-time'
      key :description, 'When the study opens for participation; null means not open.'
    end
    property :closes_at do
      key :type, :string
      key :nullable, true
      key :format, 'date-time'
      key :description, 'When the study closes for participation; null means does not close.'
    end
    property :is_mandatory do
      key :type, :boolean
      key :description, 'Mandatory studies must be completed by all users'
    end
    property :participation_points do
      key :type, :number
      key :description, 'How many points will be awarded for participation in the study'
    end
  end

  add_properties(:Study) do
    property :return_url do
      key :type, :string
      key :description, 'The URL to which stages should return after completing'
      key :readOnly, true
    end
    property :researchers do
      key :type, :array
      key :description, 'The study\'s researchers.'
      items do
        key :$ref, :Researcher
      end
    end
    property :first_launched_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study was launched; null means not launched'
    end
    property :stages do
      key :type, :array
      key :description, 'The study\'s stages.'
      items do
        key :$ref, :Stage
      end
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
              key :$ref, :Study
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

  openapi_path '/researcher/studies/{id}' do
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
