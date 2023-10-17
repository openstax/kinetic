# frozen_string_literal: true

require 'csv'

namespace :report do
  desc 'generate CSV dump of study activity'
  task :chatbot, [:start, :end] => :environment do |_, args|
    cbar = ChatbotActivityReport.new(start_date: Date.parse(args[:start]),
                                     # rubocop:todo Layout/LineLength
                                     end_date: Date.parse(args[:end]))
    # rubocop:enable Layout/LineLength
    print(cbar.as_csv_string)
  end
end
