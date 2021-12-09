# frozen_string_literal: true

def query_account_uuids(uuids)
  JSON.parse(
    OpenStax::Accounts::Api
      .search_accounts("uuid:#{uuids.join(',')}")
      .response.body
  )['items']
end

namespace :report do
  desc 'generate CSV dump of study activity'
  task :activity, [:path, :months_ago] => :environment do |_, args|
    user_uuids = {}
    launches = LaunchedStage
                 .joins(stage: :study)
                 .where('first_launched_at > ?', (args[:months_ago] || 1).to_i.months.ago)
    launches.each do |launch|
      user_uuids[launch.user_id] = nil
    end
    user_uuids.keys.in_groups_of(10) do |uuids|
      query_account_uuids(uuids.compact).each do |account|
        user_uuids[account['uuid']] = account
      end
    end
    pp user_uuids
  end
end
