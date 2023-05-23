# frozen_string_literal: true

require 'csv'

namespace :report do
  desc 'generate CSV dump of study activity'
  task :activity, [:months_ago] => :environment do |_, args|
    user_uuids = []
    launches = LaunchedStage
                 .joins(:research_id, stage: :study)
                 .where('first_launched_at >= ?', (args[:months_ago] || 1).to_i.months.ago)

    launches.each do |launch|
      user_uuids << launch.user_id
    end
    users = UserInfo.for_uuids(user_uuids)
    csv = CSV.new($stdout)
    csv << [
      'Study ID',
      'Participant Title',
      'Researcher Title',
      'Stage ID',
      'Stage Order',
      'Stage Points',
      'Stage Est Duration',
      'Started At',
      'Completed At',
      'Participant Research ID',
      'Participant Name',
      'Email',
      'Opted Out',
      'Test Account?'
    ]
    launches.each do |launch|
      account = users[launch.user_id] || {}
      email = {}
      if account['contact_infos']
        email = account['contact_infos'].find do |ci|
          ci['type'] == 'EmailAddress' &&
            ci['is_verified'] == true &&
            ci['is_guessed_preferred'] == true
        end || {}
      end
      csv << [
        launch.stage.study.id,
        launch.stage.study.title_for_participants,
        launch.stage.study.title_for_researchers,
        launch.stage.id,
        launch.stage.order,
        launch.stage.points,
        launch.stage.duration_minutes,
        launch.first_launched_at,
        launch.completed_at,
        launch.research_id.id,
        account['name'] || '',
        email['value'] || '',
        launch.stage.study.first_launched_study.opted_out_at,
        account['is_test'] ? 'X' : nil
      ]
    end
  end
end
