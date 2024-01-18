# frozen_string_literal: true

require 'csv'

namespace :report do
  desc 'generate CSV dump of study activity'
  task :chatbot, [:months_ago] => :environment do |_, args|
    cbar = ChatbotActivityReport.new(
      start_date: Date.today.beginning_of_month - (args[:months_ago] || 0).to_i.months,
      end_date: Date.today
    )
    print(cbar.as_csv_string)
  end
end
