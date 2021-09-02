# frozen_string_literal: true

class LaunchPad

  def initialize(study_id:, user_id:)
    @study_id = study_id
    @user_id = user_id
  end

  def launch_url(preview: false)
    if preview
      study.stages.order(:order).first.launcher(user_id).preview_url
    else
      raise(LaunchError, 'This study is not open.') unless study.open?

      ActiveRecord::Base.transaction do
        raise(LaunchError, 'You have already completed this study.') if launched_study.completed?

        launch = user.launch_next_stage!(study)
        launch.stage.launcher(user_id).url
      end
    end || raise('An error occurred when building a launch url')
  end

  def land
    # At any time, a user has zero or one incomplete launched stages for a particular study.
    # If they are landing, they must have one launched stage or we need to error.

    launched_stage_to_land =
      user.launched_stages(study: study)
          .where(completed_at: nil)
          .first

    raise(LandError, 'Not expecting a landing for this study') if launched_stage_to_land.nil?

    # Mark the launched records completed as needed.

    launched_stage_to_land.completed!
    launched_study.completed! if launched_stage_to_land.is_last?
  end

  protected

  attr_reader :study_id
  attr_reader :user_id

  def study
    @study ||= Study.find(study_id)
  end

  def user
    @user ||= User.new(user_id)
  end

  def launched_study
    @launched_study ||= LaunchedStudy.find_or_create_by!(study_id: study_id, user_id: user_id)
  end
end
