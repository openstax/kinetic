# frozen_string_literal: true

class Api::V0::Participant::StudiesSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  swagger_schema :Launch do
    key :required, :url
    property :url do
      key :type, :string
      key :description, 'The URL to send a user to to start a study stage'
    end
  end

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

  swagger_path '/participant/studies/:id' do
    operation :put do
      key :summary, 'Get participant-visible info for a study'
      key :description, 'Get participant-visible info for a study'
      key :operationId, 'getParticipantStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to get.'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'Success.  Returns participant-visible data for the study.'
        schema do
          key :'$ref', :ParticipantStudy
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/participant/studies/:id/launch' do
    operation :put do
      key :summary, 'Launch the next available study stage'
      key :description, 'Launch the next available study stage'
      key :operationId, 'launchStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to launch.'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'Success.  Returns info on how to launch the user.'
        schema do
          key :'$ref', :Launch
        end
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

  swagger_path '/participant/studies/:id/land' do
    operation :put do
      key :summary, 'Land a study stage'
      key :description, 'Land a study stage'
      key :operationId, 'landStudy'
      key :produces, [
        'application/json'
      ]
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to land.'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'Success.  Returns no data.'
      end
      extend Api::V0::SwaggerResponses::AuthenticationError
      extend Api::V0::SwaggerResponses::ForbiddenError
      extend Api::V0::SwaggerResponses::UnprocessableEntityError
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

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
      extend Api::V0::SwaggerResponses::ServerError
    end
  end

end
