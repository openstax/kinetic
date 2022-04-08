# frozen_string_literal: true

class Api::V1::Admin::BannersOpenApi
  include OpenStax::OpenApi::Blocks
  openapi_component do

    schema :BannerNotice do
      property :id do
        key :type, :number
        key :description, 'The Banner ID'
      end
      property :message do
        key :type, :string
        key :description, 'The messsage to display.  Limited HTML is supported'
      end
      property :start_at do
        key :type, :string
        key :format, 'date'
        key :description, 'When the message starts to display'
      end
      property :end_at do
        key :type, :string
        key :format, 'date'
        key :description, 'When the message stops to display'
      end
    end
    schema :BannersListing do
      key :required, %w[data]
      property :data do
        key :type, :array
        key :description, 'The banners.'
        items do
          key :$ref, :BannerNotice
        end
      end
    end

  end

  openapi_path '/admin/banners' do
    operation :post do
      key :summary, 'Add a banner'
      key :operationId, 'createBanner'
      request_body do
        key :description, 'The banner data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :addBanner
            property :banner do
              key :required, true
              key :$ref, :BannerNotice
            end
          end
        end
      end
      response 201 do
        key :description, 'Created.  Returns the created banner.'
        content 'application/json' do
          schema { key :$ref, :BannerNotice }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :get do
      key :summary, 'Retrive list of all banners'
      key :description, <<~DESC
        Returns listing of all banners, expired or not
      DESC
      key :operationId, 'getBanners'
      response 200 do
        key :description, 'Success.'
        content 'application/json' do
          schema { key :$ref, :BannersListing }
        end

      end
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end
  end

  openapi_path '/admin/banners/{id}' do
    operation :put do
      key :summary, 'Update a banner'
      key :operationId, 'updateBanner'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the banner to delete.'
        key :required, true
        key :schema, { type: :integer }
      end
      request_body do
        key :description, 'The banner data'
        key :required, true
        content 'application/json' do
          schema do
            key :type, :object
            key :title, :updateBanner
            property :banner do
              key :required, true
              key :$ref, :BannerNotice
            end
          end
        end
      end
      response 201 do
        key :description, 'Updated.  Returns the banner.'
        content 'application/json' do
          schema { key :$ref, :BannerNotice }
        end
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end

    operation :delete do
      key :summary, 'Remove a banner'
      key :operationId, 'deleteBanner'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of the banner to delete.'
        key :required, true
        key :schema, { type: :integer }
      end
      response 200 do
        key :description, 'Success.'
      end
      extend Api::V1::OpenApiResponses::AuthenticationError
      extend Api::V1::OpenApiResponses::ForbiddenError
      extend Api::V1::OpenApiResponses::UnprocessableEntityError
      extend Api::V1::OpenApiResponses::ServerError
    end


  end
end
