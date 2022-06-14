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
      raise(LaunchError, 'This study is not available.') unless study.available?

      ActiveRecord::Base.transaction do
        raise(LaunchError, 'You have already completed this study.') if launched_study.completed?

        stage = study.next_stage_for_user(user)
        raise 'No stage to launch exists' if stage.nil?

        stage.launch_by_user!(user)
        stage.launcher(user_id).url
      end
    end || raise('An error occurred when building a launch url')
  end

  def land(consent: true, aborted: nil)
    if aborted
      self.abort(aborted)
      return { aborted_at: Time.now }
    end

    stages = user.launched_stages(study: study)
    # At any time, a user has zero or one incomplete launched stages for a particular study.
    # If they are landing, they must have one launched stage or we need to error.
    stage = stages.where(completed_at: nil).first

    if stage.nil?
      return {
        completed_at: stages.where('completed_at is not null').last&.completed_at
      }
    end

    # Mark the launched records consented and completed as needed.
    Study.transaction do
      stage.completed!
      if consent
        launched_study.consented!
      else
        launched_study.opted_out!
      end
      launched_study.completed! if stage.is_last?
    end

    { completed_at: stage.is_last? ? stage.completed_at : nil }
  end

  def abort(reason)
    if reason == 'refusedconsent'
      launched_study.aborted!
      return
    end
    raise(LandError, 'invalid aborted reason')
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
