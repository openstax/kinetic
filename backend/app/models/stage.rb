# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study
  self.implicit_order_column = 'order'

  has_many :launched_stages do
    def for_user(user)
      # DESC will have either null or most recently completed, first
      where(user_id: user.id).order(completed_at: 'desc')
    end
  end

  has_many :launched_studies, through: :study do
    def for_user(user)
      where(user_id: user.id).order(completed_at: 'desc')
    end
  end

  has_many :siblings, ->(stage) {
    query = where(study_id: stage.study_id)
    query.where.not(id: stage.id) if stage.persisted?
    query
  }, class_name: 'Stage', foreign_key: 'study_id', primary_key: 'study_id'

  before_create :set_order

  def previous_stage
    siblings.where(Stage.arel_table[:order].lt(order)).order(:order).last
  end

  def config
    self[:config]&.with_indifferent_access
  end

  def has_been_launched_by_user?(user)
    launched_stages.for_user(user).present? # &.completed_at.nil?
  end

  def has_been_completed_by_user?(user)
    launched_study = launched_studies.for_user(user).first
    if launched_study
      launched_study.launched_stages.where(stage_id: id).where.not(completed_at: nil).first
    else
      !launched_stages.for_user(user).first&.completed_at.nil?
    end
  end

  def launchable_by_user?(user)
    # 1. the study is open and

    # 2. if it is the first stage, either:
    #     a. study has not been launched
    #     b. study has been launched, but no stages launched
    #     c. study launched, one stage (first) launched, and it's not complete
    #     d. study launched, complete, but not consented

    # 3. if this is not the first stage, all of:
    #      a. previous stage is complete and
    #      b. this stage has not been launched, or is not complete
    #      b. and is immediate launch, or available after days have passed

    return false unless study.available?

    if first_stage?
      (never_launched(user) ||
      launched_study_no_stages(user) ||
      launched_study_incomplete_first_stage(user) ||
      completed_study_not_consented(user)
      )
    else
      (previous_stage_complete(user) &&
      this_stage_not_complete_or_missing(user) &&
      immediate_or_after_days_passed(user)
      )
    end
  end

  def first_stage?
    previous_stage.nil?
  end

  def never_launched(user)
    # if study never launched
    launched_studies.for_user(user).empty?
  end

  def completed_study_not_consented(user)
    # Completed study - can only relaunch first stage for consent
    launched_study = launched_studies.for_user(user).first
    launched_study&.completed? && !launched_study.consent_granted
  end

  def launched_study_no_stages(user)
    launched_study = launched_studies.for_user(user).first
    launched_study && launched_study.launched_stages.empty?
  end

  def launched_study_incomplete_first_stage(user)
    launched_study = launched_studies.for_user(user).first
    launched_study && launched_study.launched_stages.first.incomplete?
  end

  def previous_stage_complete(user)
    launched_study = launched_studies.for_user(user).first
    if launched_study.present?
      prev_launch = launched_study.launched_stages.where(stage_id: previous_stage.id).first
    end
    !prev_launch.nil? && !prev_launch.incomplete?
  end

  def this_stage_not_complete_or_missing(user)
    launched_study = launched_studies.for_user(user).first
    launch = launched_study.launched_stages.where(stage_id: id).first if launched_study.present?
    # can complete a previous launch, but cannot launch once it's completed
    launch.present? ? launch.incomplete? : true
  end

  def immediate_or_after_days_passed(user)
    return true if available_after_days.zero? # can be launched immediately

    launched_study = launched_studies.for_user(user).first
    if launched_study.present?
      prev_launch = launched_study.launched_stages.where(stage_id: previous_stage&.id).first
    end
    prev_launch.present? ? prev_launch.completed_at.before?(available_after_days.days.ago) : false
  end

  def launcher(user_id)
    launcher = case config[:type]
               when 'qualtrics'
                 QualtricsLauncher
               else
                 raise "Unsupported stage type: '#{config[:type]}'"
               end
    launcher.new(
      **config.symbolize_keys.without(:type),
      user_id: user_id, study_id: study.id, stage_ordinal: order
    )
  end

  def launch_by_user!(user)
    stage = launched_stages.for_user(user).first
    if stage&.incomplete?
      stage
    else
      launched_stages.create!(user_id: user.id)
    end
  end

  protected

  def set_order
    self.order = (siblings.maximum(:order) || -1) + 1
  end

end
