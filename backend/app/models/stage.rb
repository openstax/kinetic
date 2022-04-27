# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study
  self.implicit_order_column = 'order'

  has_many :launched_stages do
    def for_user(user)
      # DESC so NULL sorts first
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
    !launched_stages.for_user(user).first&.completed_at.nil?
  end

  def launchable_by_user?(user)
    # launchable if:
    # 1. the associated study is not currently launched, and this is first stage
    # 2. study is currently launched, but no stages are launched, and this is the first stage
    # 3. study is currently launched, this stage is launched, but not complete
    # 4. study is currently launched, and the previous stage in this launch is complete, and the interval has passed

    # incomplete studies will be first, or nil, if never launched
    launched_study = launched_studies.for_user(user).first

    # ORDER OF TESTS IMPORTANT! Short circuiting conditions

    # only first stage is valid, if study never launched
    return previous_stage.nil? unless launched_study

    # Completed study - can only relaunch first stage for consent
    return previous_stage.nil? && !launched_study.consent_granted if launched_study.completed?

    # first stage valid if no stages launched
    return !launched_study.launched_stages if previous_stage.nil?

    prev_launch = launched_study.launched_stages.where(stage_id: previous_stage.id).first
    # only first stage is valid, if previous stage not complete
    return false if prev_launch.nil? || prev_launch.incomplete?

    launch = launched_study.launched_stages.where(stage_id: id).first
    # can complete a previous launch, but cannot launch once it's completed
    return launch.incomplete? if launch.present?

    # Confirmed that study is launched, previous stage is launched and complete, this stage has not launched
    return true if available_after_days.zero? # can be launched immediately

    # can launch once the days interval is past
    prev_launch.completed_at.before?(available_after_days.days.ago)
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
    launched_stages.create!(user_id: user.id) if launchable_by_user?(user)
  end

  protected

  def set_order
    self.order = (siblings.maximum(:order) || -1) + 1
  end

end
