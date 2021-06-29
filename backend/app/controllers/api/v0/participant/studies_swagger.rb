# frozen_string_literal: true

class Api::V0::Participant::StudiesSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  swagger_schema :PublicResearcher do
    property :name do
      key :type, :string
      key :description, 'The researcher\'s name.'
    end
    property :institution do
      key :type, :string
      key :description, 'The researcher\'s institution.'
    end
    property :bio do
      key :type, :string
      key :description, 'The researcher\'s bio.'
    end
  end

  COMMON_REQUIRED_STUDY_FIELDS = [
    :title, :short_description, :category
  ].freeze

  swagger_schema :ParticipantStudy do
    key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
  end

  add_properties(:ParticipantStudy) do
    property :id do
      key :type, :integer
      key :description, 'The study ID.'
    end
    property :title do
      key :type, :string
      key :description, 'The study title that participants see.'
    end
    property :short_description do
      key :type, :string
      key :description, 'The shorty study description that participants see.'
    end
    property :long_description do
      key :type, :string
      key :description, 'The long study description that participants see.'
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
    property :first_launched_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study was launched; null means not launched'
    end
    property :completed_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study was completed; null means not completed.'
    end
    property :opted_out_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study was opted-out of; null means not opted out.'
    end
    property :researchers do
      key :type, :array
      key :description, 'The study\'s researchers.'
      items do
        key :'$ref', :PublicResearcher
      end
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
