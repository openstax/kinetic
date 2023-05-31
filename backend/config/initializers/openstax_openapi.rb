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
      FileUtils.cp_r Rails.root.glob('api/patches/r/*'), "#{opts[:output_dir]}/R/"
      File.open("#{opts[:output_dir]}/NAMESPACE", 'a') do |f|
        f.puts('export(fetch_kinetic_responses)')
        f.puts('export(snapshot_for_kinetic_enclave)')
      end
    end
  }.symbolize_keys

end
