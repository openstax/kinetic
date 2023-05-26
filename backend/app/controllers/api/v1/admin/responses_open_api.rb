# frozen_string_literal: true

class Api::V1::Admin::ResponsesOpenApi < ApplicationController
  include OpenStax::OpenApi::Blocks

  openapi_component do

    schema :ResponseExport do
      key :required, [:id, :cutoff_at, :urls, :stage_id, :metadata, :is_complete, :is_testing]

      property :id do
        key :type, :integer
        key :description, 'The Responses download ID.'
        key :readOnly, true
      end

      property :stage_id do
        key :type, :integer
        key :description, 'The ID of the stage'
        key :readOnly, true
      end

      property :metadata do
        key :type, :object
        key :description, 'Metadata related to the responses'
      end

      property :is_complete do
        key :type, :boolean
        key :description, 'is the export/generation complete'
      end

      property :is_testing do
        key :type, :boolean
        key :description, 'are the files real or testing data'
      end

      property :cutoff_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'contains data up to this date'
      end

      property :urls do
        key :type, :array
        key :description, 'URL(s) to download study responses from'
        key :items, { 'type' => 'string' }
      end
    end

    schema :ResponsesListing do
      property :data do
        key :type, :array
        key :description, 'The responses.'
        items do
          key :$ref, :ResponseExport
        end
      end
    end

  end

end
