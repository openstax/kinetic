# frozen_string_literal: true

require 'csv'

namespace :report do
  desc 'generate CSV dump of study activity, for a month ("72") or a range of months ("12-24") ago'
  task :activity, [:months_ago] => :environment do |_, args|
    lar = LearnerActivityReport.new(months_ago: args[:months_ago])
    print(lar.as_csv_string)
  end
end
