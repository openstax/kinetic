# frozen_string_literal: true

class Api::V0::Researcher::StudiesSwagger
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

  add_properties(:Study) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
    end
  end

  add_properties(:Study, :NewStudy) do
    property :name_for_participants do
      key :type, :string
      key :description, 'The study name that participants see.'
    end
    property :name_for_researchers do
      key :type, :string
      key :description, 'An study name that only researchers see.'
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

end
