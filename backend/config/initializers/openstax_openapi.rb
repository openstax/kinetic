# frozen_string_literal: true

OpenStax::OpenApi.configure do |config| # rubocop:disable Metrics/BlockLength
  config.json_proc = lambda { |language, api_major_version|
    const = language == :r ? 'ENCLAVE' : 'OPENAPI'
    OpenStax::OpenApi.build_root_json(
      "::Api::V#{api_major_version}::OpenApiController::#{const}_CLASSES".constantize
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
    r: lambda do |version|
      {
        packageName: 'kinetic',
        exceptionPackage: 'rlang',
        operationIdNaming: 'snake_case',
        packageVersion: version,
        returnExceptionOnFailure: true
      }
    end,
    'typescript-fetch' => lambda do |_|
      {
        typescriptThreePlus: true
      }
    end
  }.symbolize_keys

  config.client_language_post_processing = {
    'typescript-fetch' => lambda do |opts|
      FileUtils.cp_r Dir.glob("#{opts[:output_dir]}/*"), Rails.root.join('../frontend/src/api/')
    end,
    'r' => lambda do |opts|
      Dir.chdir opts[:output_dir] do
        puts `patch -p2 < #{Rails.root.join('clients/r.patch')}` unless ENV['UNPATCHED'].present?
      end
    end
  }.symbolize_keys

end
