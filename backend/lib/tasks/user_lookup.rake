# frozen_string_literal: true

require 'csv'

namespace :report do
  desc 'add user info to CSV file containing uuids'
  task :user_lookup, [:file] => :environment do |_, args|

    table = CSV.read(args[:file], headers: true)

    uuids = table.map { |row| row['user_uuid'] }.uniq.compact
    puts 'no UUIDs found, is user_uuid column present?' and exit 1 if uuids.empty?

    userinfo = UserInfo.for_uuids(uuids) # .slice(0, 10))

    pn = Pathname.new(args[:file])

    CSV.open("#{pn.dirname}/#{pn.basename(pn.extname)}-with-users#{pn.extname}", 'w') do |csv|
      csv << table.headers.push(
        'first_name', 'last_name', 'email_address', 'faculty_status', 'self_reported_role'
      )

      table.each do |row|
        info = userinfo[row['user_uuid']]
        updated = row.push(
          info&.first_name, info&.last_name, info&.email_address,
          info&.faculty_status, info&.self_reported_role
        )
        csv << updated
      end
    end

  end
end
