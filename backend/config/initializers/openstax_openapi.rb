# frozen_string_literal: true

OpenStax::OpenApi.configure do |config|
  config.json_proc = lambda { |api_major_version|
    OpenStax::OpenApi.build_root_json(
      "::Api::V#{api_major_version}::OpenApiController::OPENAPI_CLASSES".constantize
    )
  }
  config.client_language_configs = {
    ruby: lambda do |version|
      {
        gemName: 'kinetic-ruby',
        gemHomepage: 'https://github.com/openstax/kinetic/backend/clients/ruby',
        gemRequiredRubyVersion: '>= 2.4',
        moduleName: 'OpenStax::Kinetic',
        gemVersion: version
      }
    end,
    'typescript-fetch' => lambda do
      {

      }
    end
  }.symbolize_keys
end
