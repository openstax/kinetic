# frozen_string_literal: true

API_MAJOR_VERSIONS = [1].freeze

desc <<-DESC.strip_heredoc
  Writes Swagger JSON files to /tmp/swagger/vX.json for each major API version X
DESC
task write_swagger_json: :environment do
  directory = Rails.root.join('tmp', 'swagger')
  FileUtils.mkdir_p(directory)

  API_MAJOR_VERSIONS.each do |api_major_version|
    swagger_data = OpenStax::Swagger.configuration.json_proc.call(api_major_version)

    File.open(File.join(directory, "v#{api_major_version}.json"), 'w') do |f|
      f.puts swagger_data.to_json
      puts "Wrote #{f.path}"
    end
  end
end
