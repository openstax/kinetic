# frozen_string_literal: true

require 'rufus-scheduler'
scheduler = Rufus::Scheduler.new

def populate_badges
  puts 'Starting the badge schedule'
  badges = OpenBadgeApi.instance.fetch_badges
  badge_ids = badges.map { |badge| badge['id'] }
  badge_ids.each do |id|
    OpenBadgeApi.instance.badge_info(id)
  end
  puts 'Fetched badges for the day'
end

# Run the job immediately
scheduler.in '30s' do
  populate_badges
end

# Then schedule it to run every 24 hours
scheduler.every '24h' do
  populate_badges
end
