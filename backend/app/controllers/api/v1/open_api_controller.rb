# frozen_string_literal: true

require 'uri'

class Api::V1::OpenApiController < ApplicationController
  include ::OpenStax::OpenApi::Blocks

  ACCEPT_HEADER = 'application/json'
  BASE_PATH = '/api/v1'

  openapi_root do
    key :openapi, '3.0.0'
    info do
      key :version, '0.1.0'
      key :title, 'OpenStax Kinetic API'
      key :description, <<~DESC
        The Kinetic API for OpenStax.

        Requests to this API should include `#{ACCEPT_HEADER}` in the `Accept` header.

        The desired API version is specified in the request URL, e.g. `[domain]#{BASE_PATH}/researcher/studies`. \
        While the API does support a default version, that version will change over \
        time and therefore should not be used in production code!
      DESC
      key :termsOfService, 'https://openstax.org/tos'
      contact do
        key :name, 'support@openstax.org'
      end
      license do
        key :name, 'MIT'
      end
    end
    tag do
      key :name, 'Kinetic'
      key :description, 'Kinetic endpoints'
    end
    server do
      key :url, BASE_PATH
    end
  end

  ENCLAVE_CLASSES = [
    Api::V1::OpenApiResponses,
    Api::V1::Researcher::ResponsesOpenApi,
    self
  ].freeze

  OPENAPI_CLASSES = [
    Api::V1::OpenApiResponses,
    Api::V1::PreferencesOpenApi,
    Api::V1::Researcher::StudiesOpenApi,
    Api::V1::Researcher::StudyResearchersOpenApi,
    Api::V1::Researcher::StagesOpenApi,
    Api::V1::Participant::StudiesOpenApi,
    Api::V1::EnvironmentOpenApi,
    Api::V1::BaseStudiesOpenApi,
    Api::V1::Admin::BannersOpenApi,
    Api::V1::Admin::RewardsOpenApi,
    Api::V1::Admin::StudiesOpenApi,
    Api::V1::Researcher::AnalysisOpenApi,
    Api::V1::Researcher::ResponsesOpenApi,
    Api::V1::ResearchersOpenApi,
    self
  ].freeze

  def json
    render json: OpenStax::OpenApi.build_root_json(OPENAPI_CLASSES)
  end
end
