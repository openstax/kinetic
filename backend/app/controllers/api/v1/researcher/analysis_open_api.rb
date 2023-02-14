# frozen_string_literal: true

class Api::V1::Researcher::AnalysisOpenApi

  include OpenStax::OpenApi::Blocks

  openapi_component do

    schema :AnalysisResearcher do
      property :user_id do
        key :type, :string
        key :description, 'UUID of researcher'
      end
      property :first_name do
        key :type, :string
        key :description, 'First name of researcher'
      end
      property :last_name do
        key :type, :string
        key :description, 'Last name of researcher'
      end
    end

    schema :StudyAnalysis do
      key :required, %w[study_id]
      property :study_id do
        key :type, :integer
        key :description, 'ID of study'
      end
    end

    schema :Analysis do
      key :required, %w[title description repository_url]
    end

    schema :AnalysisUpdate

    schema :AnalysisListing do
      property :data do
        key :type, :array
        key :description, 'The analysis.'
        items do
          key :$ref, :Analysis
        end
      end
    end
  end

  add_properties(:Analysis, :AnalysisUpdate) do
    property :id do
      key :type, :integer
      key :description, 'ID of analysis'
    end

    property :title do
      key :type, :string
      key :description, 'Title of analysis'
    end
    property :description do
      key :type, :string
      key :description, 'Long description of what analysis will perform'
    end
    property :repository_url do
      key :type, :string
      key :description, 'URL to repository containing source code'
    end
    property :api_key do
      key :type, :string
      key :description, 'Api Key of analysis'
    end

    property :researchers do
      key :type, :array
      key :description, 'The researchers working with the analysis.'
      items do
        key :$ref, :AnalysisResearcher
      end
    end

    property :studies do
      key :type, :array
      key :description, 'The studies that the analysis reads from.'
      items do
        key :$ref, :StudyAnalysis
      end
    end

  end

  openapi_path '/researcher/analysis' do

    operation :get do
      key :summary, 'Retrieve all analysis'
      key :operationId, 'listAnalysis'
      response 201 do
        key :description, 'Success. Returns the analysis.'
        content 'application/json' do
          schema { key :$ref, :AnalysisListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :post do
      key :summary, 'Add an analysis'
      key :operationId, 'addAnalysis'
      request_body do
        key :description, 'The analysis data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :addAnalysis
            property :analysis do
              key :required, true
              key :$ref, :Analysis
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
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/researcher/analysis/{id}' do
    operation :put do
      key :summary, 'Update a analysis'
      key :description, 'Update a analysis'
      key :operationId, 'updateAnalysis'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the analysis to update.'
        key :required, true
        key :schema, { type: :integer }
      end

      request_body do
        key :description, 'The analysis updates.'
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateAnalysis
            property :analysis do
              key :$ref, :AnalysisUpdate
            end
          end
        end
      end
      response 200 do
        key :description, 'Success.  Returns the updated analysis.'
        content 'application/json' do
          schema do
            key :$ref, :Analysis
          end
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

end
