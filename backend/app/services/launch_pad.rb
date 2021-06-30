# frozen_string_literal: true

class LaunchPad

  def initialize(study_id:, user_id:)
    @study_id = study_id
    @user_id = user_id
  end

  def launch
    raise(LaunchError, 'This study is not open.') unless study.open?

    url = ActiveRecord::Base.transaction do
      raise(LaunchError, 'You have already completed this study.') if launched_study.completed?

      incomplete_launched_stage = user.launched_stages(study: study).incomplete.first

      if incomplete_launched_stage
        stage_to_launch = incomplete_launched_stage.stage
      else
        completed_stage_ids = user.launched_stages(study: study).map(&:stage_id)
        stage_to_launch = study.stages.where.not(id: completed_stage_ids).order(:order).first

        LaunchedStage.create!(stage_id: stage_to_launch.id, user_id: user_id)
      end

      launch_config = stage_to_launch.config

      launcher =
        case launch_config[:type]
        when 'qualtrics'
          QualtricsLauncher
        else
          raise "Unsupported stage type: '#{launch_config[:type]}'"
        end

      launcher.new(config: launch_config, user_id: user_id).url
    end

    url || raise('An error occurred when building a launch url')
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
