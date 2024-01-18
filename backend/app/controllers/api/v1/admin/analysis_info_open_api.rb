# frozen_string_literal: true

class Api::V1::Admin::AnalysisInfoOpenApi < ApplicationController
  include OpenStax::OpenApi::Blocks

  openapi_component do

    schema :AnalysisInfo do
      key :required, [:id, :created_at, :url, :stage_id]

      property :id do
        key :type, :integer
        key :description, 'The record ID.'
        key :readOnly, true
      end

      property :stage_id do
        key :type, :integer
        key :description, 'The ID of the stage'
        key :readOnly, true
      end

      property :created_at do
        key :type, :string
        key :format, 'datetime'
        key :description, 'when info was uploaded'
      end

      property :url do
        key :type, :string
        key :description, 'URL to download study info from'
      end
    end

    schema :AnalysisInfoListing do
      property :data do
        key :type, :array
        key :description, 'The info.'
        items do
          key :$ref, :AnalysisInfo
        end
      end
    end

  end

end
