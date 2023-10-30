# frozen_string_literal: true

class Api::V1::Participant::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  COMMON_REQUIRED_STUDY_FIELDS = [
    :title, :short_description, :total_points, :total_duration
  ].freeze

  add_components do
    schema :ParticipantStudy do
      key :required, [:id] + COMMON_REQUIRED_STUDY_FIELDS
      allOf do
        schema do
          key :$ref, :BaseStudy
        end
      end
    end

    schema :ParticipantStudyCompletion do
      property :aborted_at do
        key :type, :string
        key :format, 'date-time'
        key :description, 'When the stage was aborted; null indicates stage was marked complete'
      end
      property :completed_at do
        key :type, :string
        key :format, 'date-time'
        key :description, 'When the study was completed; null indicates study is not yet complete'
      end
    end
  end

  add_components do
    schema :Launch do
      key :required, [:url]
      property :url do
        key :type, :string
        key :description, 'The URL to send a user to start a study stage'
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
        key :description, 'Has the stage been completed'
        key :readOnly, true
      end
      property :is_launchable do
        key :type, :boolean
        key :description, 'Can the stage be launched'
        key :readOnly, true
      end
      property :duration_minutes do
        key :type, :integer
        key :description, 'How long the stage lasts'
        key :readOnly, true
      end
      property :points do
        key :type, :integer
        key :description, 'How many points the stage is worth'
        key :readOnly, true
      end
      property :closes_at do
        key :type, :string
        key :nullable, true
        key :format, 'date-time'
        key :description, 'When the study closes for participation; null means does not close.'
      end
      property :feedback_types do
        key :type, :array
        key :minLength, 0
        key :items, { 'type' => 'string' }
        key :description, 'Feedback types for this stage'
      end
      property :target_sample_size do
        key :type, :number
        key :description, 'Desired sample size set by researcher'
      end
      property :status do
        key :type, :string
        key :description, 'Status of the study'
        key :enum, %w[active paused scheduled draft waiting_period ready_for_launch completed]
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
    property :popularity_rating do
      key :type, :number
      key :description, 'How popular the study is on a fractional scale of 0.0 to 1.0'
    end
    property :is_featured do
      key :type, :boolean
      key :description, 'Should this study be featured more prominently?'
      key :readOnly, true
    end
    property :is_syllabus_contest_study do
      key :type, :boolean
      key :description, 'Is this study a part of the syllabus contest?'
      key :readOnly, true
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
    property :total_points do
      key :type, :integer
      key :description, 'The study\'s total point value.'
    end
    property :total_duration do
      key :type, :integer
      key :description, 'The study\'s total duration in minutes.'
    end
  end

  openapi_path '/participant/studies/{id}' do
    operation :get do
      key :summary, 'Get participant-visible info for a study'
      key :description, 'Get participant-visible info for a study'
      key :operationId, 'getParticipantStudy'
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
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/participant/studies/{id}/launch' do
    operation :put do
      key :summary, 'Launch the next available study stage'
      key :description, 'Launch the next available study stage'
      key :operationId, 'launchStudy'
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
        key :description, 'Success. Returns info on how to launch the user.'
        content 'application/json' do
          schema { key :$ref, :Launch }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/participant/studies/{id}/land' do
    operation :put do
      key :summary, 'Land a study stage'
      key :description, 'Land a study stage'
      key :operationId, 'landStudy'
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
        key :schema, { type: :string, enum: %w[refusedconsent] }
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
        key :schema, { type: :object }
      end

      response 200 do
        key :description, 'Success.  Returns study completion status.'
        content 'application/json' do
          schema { key :$ref, :ParticipantStudyCompletion }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/participant/studies/{id}/stats' do
    operation :put do
      key :summary, 'Track stats for a study'
      key :description, 'Stats include view count, etc.'
      key :operationId, 'studyStats'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to track.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :view
        key :in, :query
        key :description, 'Command to increment view_count on a study'
        key :required, false
        key :schema, { type: :boolean }
      end

      response 200 do
        key :description, 'Success.  Returns study with updated view count.'
        content 'application/json' do
          schema { key :$ref, :ParticipantStudy }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/participant/studies' do
    operation :get do
      key :summary, 'Get studies (available and completed) for the participant'
      key :description, <<~DESC
        Get studies for the calling researcher.
      DESC
      key :operationId, 'getParticipantStudies'
      response 200 do
        key :description, 'Success.  Returns the studies.'
        content 'application/json' do
          schema { key :$ref, :ParticipantStudies }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

end
