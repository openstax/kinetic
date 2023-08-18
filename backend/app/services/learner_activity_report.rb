# frozen_string_literal: true

require 'csv'

class LearnerActivityReport
  def initialize(months_ago:)
    @months_ago = months_ago
    @user_uuids = []
    @csv_string = CSV.generate do |csv|
      generate_report(csv)
    end
  end

  def as_csv_string
    @csv_string
  end

  def build_headers(csv)
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
  end

  def get_users(launches)
    launches.each do |launch|
      @user_uuids << launch.user_id
    end
    UserInfo.for_uuids(@user_uuids)
  end

  def find_user_email(account)
    account['contact_infos'].find do |ci|
      ci['type'] == 'EmailAddress' &&
        ci['is_verified'] == true &&
        ci['is_guessed_preferred'] == true
    end || {}
  end

  def build_rows(csv, users, launches)
    launches.each do |launch|
      account = users[launch.user_id] || {}
      email = find_user_email(account)

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

  def generate_report(csv)
    launches = LaunchedStage
                 .joins(:research_id, stage: :study)
                 .where('first_launched_at >= ?', (@months_ago || 1).to_i.months.ago)

    users = get_users(launches)
    build_headers(csv)
    build_rows(csv, users, launches)
  end
end
