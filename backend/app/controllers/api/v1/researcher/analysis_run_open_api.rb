# frozen_string_literal: true

class Api::V1::Researcher::AnalysisRunOpenApi

  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :AnalysisRun do
      key :required, %w[api_key analysis_id analysis_api_key]
      property :id do
        key :type, :integer
        key :description, 'ID of analysis run'
        key :readOnly, true
      end
      property :api_key do
        key :type, :string
        key :description, 'Api key to use for recording progress of run'
      end
      property :message do
        key :type, :string
        key :description, 'Commit message of the analysis run'
      end
      property :messages do
        key :type, :array
        key :description, 'The analysis run messages.'
        items do
          key :$ref, :AnalysisRunMessage
        end
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
      property :finished_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When was run completed'
      end
    end

    schema :AnalysisRunMessage do
      property :id do
        key :type, :integer
        key :description, 'ID of analysis run message'
        key :readOnly, true
      end
      property :analysis_run_id do
        key :type, :integer
        key :description, 'ID of analysis run'
        key :readOnly, true
      end
      property :message do
        key :type, :string
        key :description, 'The message'
      end
      property :stage do
        key :type, :string
        key :description, 'Current stage of the process'
        key :enum, %w[archive review package run check end]
      end
      property :level do
        key :type, :string
        key :description, 'Status of the stage'
        key :enum, %w[info error debug]
      end
      property :created_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'When was run message was created'
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
