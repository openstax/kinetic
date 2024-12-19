# frozen_string_literal: true

require 'csv'

class LearnerActivityReport
  def initialize(months_ago:)
    @months_ago = months_ago
    @user_uuids = []
  end

  def as_csv_string
    CSV.generate do |csv|
      generate_report(csv)
    end
  end

  def build_headers(csv)
    csv << [
      'Study ID',
      'Participant Title',
      'Researcher Title',
      'Study Path Title',
      'Completed Study Path',
      'Study Category',
      'Stage ID',
      'Stage Order',
      'Stage Est Duration',
      'Started At',
      'Completed At',
      'Participant Created At',
      'Participant Research ID',
      'New Participant Study?',
      'Test Account?'
    ]
  end

  def get_users(launches)
    @user_uuids = launches.clone.pluck('user_id')
    UserInfo.for_uuids(@user_uuids)
  end

  def did_current_study_lead_to_learning_path_completion(launch)
    learning_path = launch.stage.study.learning_path
    total_studies = 0
    completed_studies_count = 0
    current_study_led_to_completion = false

    if learning_path
      total_studies = learning_path.studies.count
      completed_studies = learning_path.studies
                            .joins(:launched_stages)
                            .where(launched_stages: { user_id: launch.user_id })
                            .where.not(launched_stages: { completed_at: nil })

      completed_studies_count = completed_studies.count
      latest_completed_study = completed_studies.order('launched_stages.completed_at DESC').first

      if latest_completed_study && latest_completed_study.id == launch.stage.study.id &&
         completed_studies_count == total_studies
        current_study_led_to_completion = true
      end
    end
    current_study_led_to_completion
  end

  def build_rows(csv, users, launches)
    launches.includes(:stage, :research_id, study: :first_launched_study).find_each do |launch|
      next if launch.stage.study.first_launched_study.opted_out_at

      account = users[launch.user_id] || {}
      study_path_title = launch.stage.study.learning_path.label if launch.stage.study.learning_path
      current_study_led_to_completion = did_current_study_lead_to_learning_path_completion(launch)

      csv << [
        launch.stage.study.id,
        launch.stage.study.title_for_participants,
        launch.stage.study.title_for_researchers,
        study_path_title,
        current_study_led_to_completion,
        launch.stage.study.category,
        launch.stage.id,
        launch.stage.order,
        launch.stage.duration_minutes,
        launch.first_launched_at,
        launch.completed_at,
        launch.research_id.created_at,
        launch.research_id.id,
        launch.research_id.is_new_user?(launch.first_launched_at),
        account['is_test'] ? 'X' : nil
      ]
    end
  end

  def generate_report(csv)
    launches = LaunchedStage
                 .joins(stage: :study)
                 .where('first_launched_at >= ?', (@months_ago || 1).to_i.months.ago)

    users = get_users(launches)
    build_headers(csv)
    build_rows(csv, users, launches)
  end
end
