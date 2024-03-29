# frozen_string_literal: true

class Api::V1::Researcher::AnalysisRunOpenApi

  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :AnalysisRun do
      key :required, %w[id api_key analysis_id analysis_api_key]
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
      property :status do
        key :type, :string
        key :description, 'Current status of the run'
        key :enum, %w[pending complete error canceled]
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

  openapi_path '/researcher/analysis/{analysis_id}/run/{run_id}' do

    operation :post do
      key :summary, 'Update an analysis run'
      key :operationId, 'updateAnalysisRun'
      parameter do
        key :name, :run_id
        key :in, :path
        key :description, 'ID of the run to update.'
        key :required, true
        key :schema, { type: :integer }
      end
      parameter do
        key :name, :analysis_id
        key :in, :path
        key :description, 'ID of the analysis that the run belongs to'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The analysis data'
        key :required, true
        content 'application/json' do
          schema do
            key :required, %w[status]
            key :type, :object
            key :title, :updateAnalysisRun
            property :status do
              key :type, :string
              key :description, 'Updated status'
            end
          end
        end
      end
      response 200 do
        key :description, 'Updated.  Returns the analysis.'
        content 'application/json' do
          schema { key :$ref, :Analysis }
        end
      end
    end

  end

end
