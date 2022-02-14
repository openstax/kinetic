# frozen_string_literal: true

# the dev admin user query for testing:
# JSON.parse(OpenStax::Accounts::Api.search_accounts("uuid:aaa560a1-e828-48fb-b9a8-d01e9aec71d0").response.body)

require 'csv'

def query_account_uuids(uuids)
  search = uuids.map { |uuid| "uuid:#{uuid}" }
  JSON.parse(
    OpenStax::Accounts::Api
      .search_accounts(search.join(' '))
      .response.body
  )['items']
end

namespace :report do
  desc 'generate CSV dump of study activity'
  task :activity, [:months_ago] => :environment do |_, args|
    user_uuids = {}
    launches = LaunchedStage
                 .joins(stage: :study)
                 .where('first_launched_at >= ?', (args[:months_ago] || 1).to_i.months.ago)
    launches.each do |launch|
      user_uuids[launch.user_id] = nil
    end
    user_uuids.keys.in_groups_of(10) do |uuids|
      query_account_uuids(uuids.compact).each do |account|
        user_uuids[account['uuid']] = account
      end
    end
    csv = CSV.new($stdout)
    csv << [
      'Study ID',
      'Study Name',
      'Participant UUID',
      'Participant Name',
      'Email',
      'Launched',
      'Opted Out',
      'Completed'
    ]
    launches.each do |launch|
      account = user_uuids[launch.user_id]
      email = nil
      if account
        email = account['contact_infos'].find do |ci|
          ci['type'] == 'EmailAddress' &&
            ci['is_verified'] == true &&
            ci['is_guessed_preferred'] == true
        end
      end
      csv << [
        launch.stage.study.id,
        launch.stage.study.title_for_participants,
        launch.user_id,
        account&.name || '',
        email&.value || '',
        launch.first_launched_at,
        launch.stage.study.first_launched_study.opted_out_at
      ]
    end
  end
end
