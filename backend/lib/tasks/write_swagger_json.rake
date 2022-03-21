# frozen_string_literal: true

API_MAJOR_VERSIONS = [1].freeze

desc <<-DESC.strip_heredoc
  Writes Openapi JSON files to /tmp/openapi/vX.json for each major API version X
DESC
task write_openapi_json: :environment do
  directory = Rails.root.join('tmp', 'openapi')
  FileUtils.mkdir_p(directory)

  API_MAJOR_VERSIONS.each do |api_major_version|
    openapi_data = OpenStax::OpenApi.configuration.json_proc.call(api_major_version)

    File.open(File.join(directory, "v#{api_major_version}.json"), 'w') do |f|
      f.puts openapi_data.to_json
      puts "Wrote #{f.path}"
    end
  end
end
