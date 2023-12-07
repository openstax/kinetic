# frozen_string_literal: true

class Api::V1::PreferencesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do

    schema :UserPreferences do
      property :cycle_deadlines_email do
        key :type, :boolean
        key :description, 'User wishes to receive email about cycle deadlines'
      end
      property :prize_cycle_email do
        key :type, :boolean
        key :description, 'User wishes to receive email about price deadlines'
      end
      property :study_available_email do
        key :type, :boolean
        key :description, 'User wishes to receive email about study availibility'
      end
      property :session_available_email do
        key :type, :boolean
        key :description, 'User wishes to receive email about new sessions becoming available'
      end
      property :has_viewed_analysis_tutorial do
        key :type, :boolean
        key :description,
            'Researcher has viewed the analysis tutorial overview on the researcher analysis page'
      end
      property :has_viewed_welcome_message do
        key :type, :boolean
        key :description, 'Learner has viewed the initial welcome message on the learner dashboard'
      end
    end
  end

  openapi_path '/preferences' do
    operation :get do
      key :summary, 'Obtain the current users preferences'
      key :description, <<~DESC
        Returns the preferences, will create a default set of preferences if the user not saved them previously
      DESC
      key :operationId, 'getPreferences'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :UserPreferences }
        end
      end
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
    operation :post do
      key :summary, 'Create or update the users preferences'
      key :operationId, 'updatePreferences'

      request_body do
        key :description, 'The preferences to update.'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updatePreferences
            property :preferences do
              key :$ref, :UserPreferences
            end
          end
        end
      end
      response 201 do
        key :description, 'Updated.  Returns the preferences.'
        content 'application/json' do
          schema { key :$ref, :UserPreferences }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
