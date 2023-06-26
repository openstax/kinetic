# frozen_string_literal: true

class Api::V1::Researcher::AnalysisRunOpenApi

  include OpenStax::OpenApi::Blocks

  openapi_component do

    schema :AnalysisRun do
      key :required, %w[api_key analysis_id analysis_api_key]

      property :api_key do
        key :type, :string
        key :description, 'Api key to use for recording progress of run'
      end
      property :analysis_id do
        key :type, :integer
        key :description, 'Id of Analysis'
      end
      property :analysis_api_key do
        key :type, :integer
        key :description, 'Api key to obtain analysis data'
      end
      property :did_succeed do
        key :type, :boolean
        key :description, 'has run succeeded'
      end
      property :started_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When was run started'
      end
      property :finshed_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When was run completed'
      end
    end

  end

  openapi_path '/researcher/analysis/:analysis_id/runs' do

    operation :post do
      key :summary, 'Create an analysis run'
      key :operationId, 'createAnalysisRun'
      request_body do
        key :description, 'The analysis data'
        key :required, true
        content 'application/json' do
          schema do
            key :required, %w[message]
            key :type, :object
            key :title, :createAnalysisRun
            property :message do
              key :type, :string
              key :description, 'Message describing run'
            end
          end
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created analysis.'
        content 'application/json' do
          schema { key :$ref, :Analysis }
        end
      end
    end

  end

end