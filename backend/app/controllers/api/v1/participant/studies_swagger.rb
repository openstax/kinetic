# frozen_string_literal: true

class Api::V1::Participant::StudiesSwagger
  include Swagger::Blocks
  include OpenStax::Swagger::SwaggerBlocksExtensions

  COMMON_REQUIRED_STUDY_FIELDS = [
    :title, :short_description, :tags, :duration_minutes
  ].freeze

  swagger_component do

    schema :ParticipantStudy do
      key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
    end

    schema :Launch do
      key :required, [:url]
      property :url do
        key :type, :string
        key :description, 'The URL to send a user to to start a study stage'
      end
    end
    schema :PublicResearcher do
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

    schema :ParticipantStudyStage do
      property :order do
        key :type, :integer
        key :description, 'An integer that describes the sort order for this stage'
        key :readOnly, true
      end
      property :title do
        key :type, :string
        key :description, 'The name of the stage'
        key :readOnly, true
      end
      property :description do
        key :type, :string
        key :description, 'The longer description shown to participants'
        key :readOnly, true
      end
      property :available_after_days do
        key :type, :number
        key :description, 'How many days after previous stage will this become available'
        key :readOnly, true
      end
      property :is_completed do
        key :type, :boolean
        key :description, 'Has the stage been launched'
        key :readOnly, true
      end
      property :is_launchable do
        key :type, :boolean
        key :description, 'Can the stage be launched'
        key :readOnly, true
      end
    end
    schema :ParticipantStudies do
      property :data do
        key :type, :array
        key :description, 'The studies.'
        items do
          key :$ref, :ParticipantStudy
        end
      end
    end
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
    property :tags do
      key :type, :array
      key :items, { 'type' => 'string' }
      key :description, 'The tags of the study object, used for grouping and filtering.'
    end
    property :duration_minutes do
      key :type, :integer
      key :description, 'The expected study duration in minutes.'
    end
    property :participation_points do
      key :type, :integer
      key :description, 'How many points a participant will earn upon completion'
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
    property :closes_at do
      key :type, :string
      key :format, 'date-time'
      key :description, 'When the study ends; null means open indefinitely.'
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
        key :$ref, :PublicResearcher
      end
    end
    property :stages do
      key :type, :array
      key :description, 'The study\'s stages.'
      items do
        key :$ref, :ParticipantStudyStage
      end
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

  swagger_path '/participant/studies/{id}' do
    operation :get do
      key :summary, 'Get participant-visible info for a study'
      key :description, 'Get participant-visible info for a study'
      key :operationId, 'getParticipantStudy'
      # key :tags, [
      #   'Studies'
      # ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to get.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success.  Returns participant-visible data for the study.'
        content 'application/json' do
          schema { key :$ref, :ParticipantStudy }
        end
      end
      extend Api::V1::SwaggerResponses::AuthenticationError
      extend Api::V1::SwaggerResponses::ForbiddenError
      extend Api::V1::SwaggerResponses::UnprocessableEntityError
      extend Api::V1::SwaggerResponses::ServerError
    end
  end

  swagger_path '/participant/studies/{id}/launch' do
    operation :put do
      key :summary, 'Launch the next available study stage'
      key :description, 'Launch the next available study stage'
      key :operationId, 'launchStudy'
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to launch.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :preview
        key :in, :query
        key :description, 'Whether the launch is a preview'
        key :required, false
        key :schema, { type: :boolean }
      end
      response 200 do
        key :description, 'Success.  Returns info on how to launch the user.'
        content 'application/json' do
          schema { key :$ref, :Launch }
        end
      end
      extend Api::V1::SwaggerResponses::AuthenticationError
      extend Api::V1::SwaggerResponses::ForbiddenError
      extend Api::V1::SwaggerResponses::UnprocessableEntityError
      extend Api::V1::SwaggerResponses::ServerError
    end
  end

  swagger_path '/participant/studies/{id}/land' do
    operation :put do
      key :summary, 'Land a study stage'
      key :description, 'Land a study stage'
      key :operationId, 'landStudy'
      key :tags, [
        'Studies'
      ]
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to land.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :aborted
        key :in, :query
        key :description, 'Optional reason study was aborted early'
        key :required, false
        key :schema, { type: :integer, enum: %w[refusedconsent] }
      end
      parameter do
        key :name, :consent
        key :in, :query
        key :description, 'Optional flag indicating if student consented (default true)'
        key :required, false
        key :schema, { type: :boolean }
      end
      parameter do
        key :name, :md
        key :in, :query
        key :description, 'Metadata to record for participant'
        key :schema, { format: :object }
      end

      response 200 do
        key :description, 'Success.  Returns no data.'
      end
      extend Api::V1::SwaggerResponses::AuthenticationError
      extend Api::V1::SwaggerResponses::ForbiddenError
      extend Api::V1::SwaggerResponses::UnprocessableEntityError
      extend Api::V1::SwaggerResponses::ServerError
    end
  end

  swagger_path '/participant/studies' do
    operation :get do
      key :summary, 'Get studies (available and completed) for the participant'
      key :description, <<~DESC
        Get studies for the calling researcher.
      DESC
      key :operationId, 'getParticipantStudies'
      key :tags, [
        'Studies'
      ]
      response 200 do
        key :description, 'Success.  Returns the studies.'
        content 'application/json' do
          schema { key :$ref, :ParticipantStudies }
        end
      end
      extend Api::V1::SwaggerResponses::AuthenticationError
      extend Api::V1::SwaggerResponses::ServerError
    end
  end

end
