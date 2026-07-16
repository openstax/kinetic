# frozen_string_literal: true

require 'csv'

class LearnerActivityReport
  DEFAULT_MONTHS_AGO = 1

  def initialize(months_ago:)
    @months_ago = months_ago
    @user_uuids = []
  end

  MONTHS_AGO_FORMAT = /\A\s*(\d+)\s*(?:-\s*(\d+)\s*)?\z/

  # Accepts either a single bound ("72" => everything since 72 months ago) or a
  # range ("12-24" => the window between 12 and 24 months ago).  Range bounds may
  # be given in either order.  Reporting over a bounded window keeps the account
  # lookup small enough for Accounts to accept the request.
  def month_bounds
    raw = @months_ago.to_s
    return [DEFAULT_MONTHS_AGO, nil] if raw.strip.empty?

    match = MONTHS_AGO_FORMAT.match(raw)
    raise ArgumentError, "expected a month or a range of months, got: #{@months_ago.inspect}" unless match

    newest, oldest = match.captures.compact.map(&:to_i)
    oldest ? [newest, oldest].minmax : [newest, nil]
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
      'Participant UUID',
      'Participant Name',
      'Test Account?'
    ]
  end

  # A participant appears once per launched stage, so plucking without de-duping
  # sends the same uuid to Accounts many times over and can overflow the request.
  def get_users(launches)
    @user_uuids = launches.clone.distinct.pluck('launched_stages.user_id')
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
        launch.user_id,
        account['name'] || '',
        account['is_test'] ? 'X' : nil
      ]
    end
  end

  def launches
    newest, oldest = month_bounds

    scope = LaunchedStage
              .joins(stage: :study)
              .where('first_launched_at >= ?', (oldest || newest).months.ago)

    scope = scope.where('first_launched_at < ?', newest.months.ago) if oldest
    scope
  end

  def generate_report(csv)
    launches = self.launches

    users = get_users(launches)
    build_headers(csv)
    build_rows(csv, users, launches)
  end
end
