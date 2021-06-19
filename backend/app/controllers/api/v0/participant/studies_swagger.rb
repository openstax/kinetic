class Api::V0::Participant::StudiesSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  COMMON_REQUIRED_STUDY_FIELDS = [
    :name, :description
  ]

  swagger_schema :ParticipantStudy do
    key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
  end

  add_properties(:ParticipantStudy) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
    end
    property :name do
      key :type, :string
      key :description, 'The study name that participants see.'
    end
    property :description do
      key :type, :string
      key :description, 'The study description that participants see.'
    end
    property :category do
      key :type, :string
      key :enum, ['research_study', 'cognitive_task', 'survey']
      key :description, 'The category of the study object, used for grouping.'
    end
    property :duration_minutes do
      key :type, :integer
      key :description, 'The expected study duration in minutes.'
    end
    property :is_started do
      key :type, :boolean
      key :description, 'True if has been started'
    end
    property :is_completed do
      key :type, :boolean
      key :description, 'True if has been completed'
    end
  end

  swagger_schema :ParticipantStudies do
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
        key :'$ref', :ParticipantStudy
      end
    end
  end

  # swagger_path '/participant/studies/:id/start' do
  #   operation :post do
  #     key :summary, 'Add a study'
  #     key :description, 'Add a study'
  #     key :operationId, 'addStudy'
  #     key :produces, [
  #       'application/json'
  #     ]
  #     key :tags, [
  #       'Studies'
  #     ]
  #     parameter do
  #       key :name, :study
  #       key :in, :body
  #       key :description, 'The study data'
  #       key :required, true
  #       schema do
  #         key :'$ref', :NewStudy
  #       end
  #     end
  #     response 201 do
  #       key :description, 'Created.  Returns the created study.'
  #       schema do
  #         key :'$ref', :Study
  #       end
  #     end
  #     extend Api::V0::SwaggerResponses::AuthenticationError
  #     extend Api::V0::SwaggerResponses::ForbiddenError
  #     extend Api::V0::SwaggerResponses::UnprocessableEntityError
  #     extend Api::V0::SwaggerResponses::ServerError
  #   end
  # end

  swagger_path '/participant/studies' do
    operation :get do
      key :summary, 'Get studies (available and completed) for the participant'
      key :description, <<~DESC
        Get studies for the calling researcher.
      DESC
      key :operationId, 'getParticipantStudies'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      response 200 do
        key :description, 'Success.  Returns the studies.'
        schema do
          key :'$ref', :ParticipantStudies
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

end
