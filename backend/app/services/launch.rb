class Launch

  def initialize(study_id:, user_id:)
    @study_id = study_id
    @user_id = user_id
  end

  def do_it
    raise(LaunchError, 'This study is not open.') unless study.open?

    url = ActiveRecord::Base.transaction do
      launched_study = LaunchedStudy.find_or_create_by!(study_id: study_id, user_id: user_id)
      raise(LaunchError, 'You have already completed this study.') if launched_study.completed?

      next_stage = study.stages
                        .left_joins(:launched_stages)
                        .where(LaunchedStage.arel_table[:id].eq(nil).or(
                              LaunchedStage.arel_table[:user_id].eq(user_id)))
                        .order(:order)
                        .first

      launcher =
        case next_stage.config[:type]
        when 'qualtrics'
          QualtricsLauncher
        else
          raise "Unsupported stage type: '#{next_stage.config[:type]}'"
        end

      LaunchedStage.create!(stage_id: next_stage.id, user_id: user_id)

      launcher.new(config: next_stage.config, user_id: user_id).url
    end

    url || raise('An error occurred when building a launch url')
  end

  protected

  attr_reader :study_id, :user_id

  def study
    @study ||= Study.find(study_id)
  end

  def user
    @user ||= User.new(user_id)
  end
end
