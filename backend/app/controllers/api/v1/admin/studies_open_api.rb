# frozen_string_literal: true

class Api::V1::Admin::StudiesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :AdminStudyFilesListing do
      key :required, [:responses, :infos]

      property :responses do
        key :type, :array
        key :description, 'The responses for the study'
        items do
          key :$ref, :ResponseExport
        end
      end

      property :infos do
        key :type, :array
        key :description, 'The info files for the study'
        items do
          key :$ref, :AnalysisInfo
        end
      end
    end
  end

  openapi_path '/admin/studies/{status}' do
    operation :get do
      key :summary, 'Retrieve all studies with status'
      key :description, <<~DESC
        Returns listing of all studies with status approval,
      DESC
      key :operationId, 'adminQueryStudies'

      parameter do
        key :name, :status
        key :in, :path
        key :description,
            'fetch studies with the given status. "all" will return all studies'
        key :required, true
        key :schema, { type: :string, format: 'string', example: 'approved' }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :Studies }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/stage/{stage_id}/responses' do
    operation :post do
      key :summary, 'add a response file'
      key :operationId, 'adminAddResponses'

      parameter do
        key :name, :stage_id
        key :in, :path
        key :description, 'id of stage'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The response data'
        key :required, true
        content 'multipart/form-data' do
          schema do
            property :is_testing do
              key :type, :boolean
              key :description, 'is test data, not real'
            end
            property :file do
              key :type, :string
              key :format, 'binary'
            end
          end
        end
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/stage/{stage_id}/infos' do
    operation :post do
      key :summary, 'add a info file'
      key :operationId, 'adminAddInfo'

      parameter do
        key :name, :stage_id
        key :in, :path
        key :description, 'id of stage'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The info data'
        key :required, true
        content 'multipart/form-data' do
          schema do
            property :file do
              key :type, :string
              key :format, 'binary'
            end
          end
        end
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/stage/{stage_id}/analysis_info' do
    operation :post do
      key :summary, 'add an analysis info file'
      key :operationId, 'adminAddAnalysisInfo'

      parameter do
        key :name, :stage_id
        key :in, :path
        key :description, 'id of stage'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The html formatted info file'
        key :required, true
        content 'multipart/form-data' do
          schema do
            property :file do
              key :type, :string
              key :format, 'binary'
            end
          end
        end
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/response/{id}' do
    operation :delete do
      key :summary, 'remove a response file'
      key :operationId, 'adminDestroyResponse'

      parameter do
        key :name, :id
        key :in, :path
        key :description, 'id of response'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/info/{id}' do
    operation :delete do
      key :summary, 'remove a info file'
      key :operationId, 'adminDestroyInfo'

      parameter do
        key :name, :id
        key :in, :path
        key :description, 'id of info'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/study/{id}/files' do
    operation :get do
      key :summary, 'Retrieve all responses for study'
      key :description, <<~DESC
        Returns listing of all responses and info files for a study
      DESC
      key :operationId, 'adminFilesForStudy'

      parameter do
        key :name, :id
        key :in, :path
        key :description,
            'fetch responses and help for the study with the given id'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :AdminStudyFilesListing }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/studies/{id}/approve' do
    operation :post do
      key :summary, 'Approve a study'
      key :operationId, 'adminApproveStudy'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the study to approve.'
        key :required, true
        key :schema, { type: :integer }
      end

      response 200 do
        key :description, <<~DESC
          Study approved. Returns the new list of studies waiting for approval.
        DESC
        content 'application/json' do
          schema { key :$ref, :Studies }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/studies/feature' do
    operation :post do
      key :summary, 'Mark studies as featured'
      key :operationId, 'adminFeatureStudies'

      request_body do
        key :description, 'The study IDs to feature'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :featuredStudyIds
            property :featured_ids do
              key :type, :array
              key :description, 'Studies that are featured'
              key :items, { 'type' => 'number' }
            end
            property :non_featured_ids do
              key :type, :array
              key :description, 'Studies that are not featured'
              key :items, { 'type' => 'number' }
            end
          end
        end
      end

      response 200 do
        key :description, 'Success'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/studies/highlight' do
    operation :post do
      key :summary, 'Mark studies as highlighted'
      key :operationId, 'adminHighlightStudies'

      request_body do
        key :description, 'The study IDs to highlight'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :highlightedStudyIds
            property :highlighted_ids do
              key :type, :array
              key :description, 'Studies to be highlighted'
              key :items, { 'type' => 'number' }
            end
          end
        end
      end

      response 200 do
        key :description, 'Success'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/studies/welcome' do
    operation :post do
      key :summary, 'Set welcome modal studies'
      key :operationId, 'adminWelcomeStudies'

      request_body do
        key :description, 'The study IDs for welcome modal'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :welcomeStudyIds
            property :welcome_ids do
              key :type, :array
              key :description, 'Studies for welcome modal'
              key :items, { 'type' => 'number' }
            end
          end
        end
      end

      response 200 do
        key :description, 'Success'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end
end
