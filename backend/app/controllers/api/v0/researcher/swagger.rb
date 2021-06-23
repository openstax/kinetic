# frozen_string_literal: true

class Api::V0::Researcher::Swagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  COMMON_REQUIRED_STUDY_FIELDS = [
    :name_for_participants, :description_for_participants
  ].freeze

  swagger_schema :Study do
    key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
  end

  swagger_schema :NewStudy do
    key :required, COMMON_REQUIRED_STUDY_FIELDS
  end

  swagger_schema :StudyUpdate

  add_properties(:Study, :StudyUpdate) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
      key :readOnly, true
    end
  end

  add_properties(:Study, :NewStudy, :StudyUpdate) do
    property :name_for_participants do
      key :type, :string
      key :description, 'The study name that participants see.'
      key :minLength, 1
    end
    property :name_for_researchers do
      key :type, :string
      key :description, 'An study name that only researchers see.'
      key :minLength, 1
    end
    property :description_for_participants do
      key :type, :string
      key :description, 'The study description that participants see.'
    end
    property :description_for_researchers do
      key :type, :string
      key :description, 'A study description that only researchers see.'
    end
    property :category do
      key :type, :string
      key :enum, %w[research_study cognitive_task survey]
      key :description, 'The category of the study object, used for grouping.'
    end
    property :duration_minutes do
      key :type, :integer
      key :description, 'The expected study duration in minutes.'
    end
    property :opens_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study opens for participation; null means not open.'
    end
    property :closes_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study closes for participation; null means does not close.'
    end
  end

  add_properties(:Study) do
    property :researchers do
      key :type, :array
      key :description, 'The study\'s researchers.'
      items do
        key :'$ref', :Researcher
      end
    end
    property :stages do
      key :type, :array
      key :description, 'The study\'s stages.'
      items do
        key :'$ref', :Stage
      end
    end
  end

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

  swagger_schema :Studies do
    # organization from https://jsonapi.org/
    # property :meta do
    #   property :page do
    #     key :type, :integer
    #     key :description, 'The current page number for these paginated results, one-indexed.'
    #   end
    #   property :per_page do
    #     key :type, :integer
    #     key :description, 'The requested number of results per page.'
    #   end
    #   property :count do
    #     key :type, :integer
    #     key :description, 'The number of results in the current page.'
    #   end
    #   property :total_count do
    #     key :type, :integer
    #     key :description, 'The number of results across all pages.'
    #   end
    # end
    property :data do
      key :type, :array
      key :description, 'The studies.'
      items do
        key :'$ref', :Study
      end
    end
  end

  swagger_path '/research/studies' do
    operation :post do
      key :summary, 'Add a study'
      key :description, 'Add a study'
      key :operationId, 'addStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :study
        key :in, :body
        key :description, 'The study data'
        key :required, true
        schema do
          key :'$ref', :NewStudy
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created study.'
        schema do
          key :'$ref', :Study
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/studies' do
    operation :get do
      key :summary, 'Get studies for the calling researcher'
      key :description, <<~DESC
        Get studies for the calling researcher.
      DESC
      key :operationId, 'getStudies'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      response 200 do
        key :description, 'Success.  Returns the studies.'
        schema do
          key :'$ref', :Studies
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/studies/{id}' do
    operation :put do
      key :summary, 'Update a study'
      key :description, 'Update a study'
      key :operationId, 'updateStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to update.'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :study
        key :in, :body
        key :description, 'The study updates.'
        key :required, true
        schema do
          key :'$ref', :StudyUpdate
        end
      end
      response 200 do
        key :description, 'Success.  Returns the updated study.'
        schema do
          key :'$ref', :Study
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
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

  swagger_schema :NewStage do
    key :required, %w[config]
  end

  swagger_schema :StageUpdate do
    key :required, %w[id config]
  end

  swagger_schema :Stage do
    key :required, %w[id order config return_url]
  end

  add_properties(:Stage) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
      key :readOnly, true
    end
  end

  add_properties(:Stage) do
    property :order do
      key :type, :integer
      key :description, 'An integer that describes the sort order for this stage'
      key :readOnly, true
    end
    property :return_url do
      key :type, :string
      key :description, 'The URL to which external study apps should return after completing to end this stage'
      key :readOnly, true
    end
  end

  add_properties(:Stage, :NewStage, :StageUpdate) do
    property :config do
      key :type, :object
      key :description,  'The configuration for a particular kind of stage, e.g. Qualtrics.  See `QualtricsStage`'
    end
  end

  swagger_schema :QualtricsStage do
    key :required, %w[type url secret_key]
    property :type do
      key :type, :string
      key :description, 'The type of this stage config'
      key :enum, %w[qualtrics]
    end
    property :url do
      key :type, :string
      key :description, 'The Qualtrics URL that this stage launches to'
      key :minLength, 1
    end
    property :secret_key do
      key :type, :string
      key :description, 'The Qualtrics survey secret used to encrypt information we send to Qualtrics'
      key :minLength, 1
    end
  end

  swagger_path '/research/studies/{id}/stages' do
    operation :post do
      key :summary, 'Add a stage to a study'
      key :description, 'Add a stage to study'
      key :operationId, 'addStage'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :stage
        key :in, :body
        key :description, 'The stage data'
        key :required, true
        schema do
          key :'$ref', :NewStage
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created stage.'
        schema do
          key :'$ref', :Stage
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/stages/{id}' do
    operation :get do
      key :summary, 'Get a stage'
      key :description, 'Get a stage'
      key :operationId, 'getStage'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the stage to get.'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'Success.  Returns the stage.'
        schema do
          key :'$ref', :Stage
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/stages/{id}' do
    operation :put do
      key :summary, 'Update a stage'
      key :description, 'Update a stage'
      key :operationId, 'updateStage'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the stage to update.'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :stage
        key :in, :body
        key :description, 'The stage updates.'
        key :required, true
        schema do
          key :'$ref', :StageUpdate
        end
      end
      response 200 do
        key :description, 'Success.  Returns the updated stage.'
        schema do
          key :'$ref', :Stage
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/research/stages/{id}' do
    operation :delete do
      key :summary, 'Delete a stage'
      key :description, 'Delete a stage'
      key :operationId, 'deleteStage'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the stage to delete.'
        key :required, true
        key :type, :string
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
