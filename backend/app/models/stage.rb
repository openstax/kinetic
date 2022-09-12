# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study

  has_many :launches, class_name: 'LaunchedStage', foreign_key: :stage_id

  self.implicit_order_column = 'order'

  has_many :launched_stages do
    def for_user(user)
      where(user_id: user.id).first
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

  def next_stage
    siblings.where(Stage.arel_table[:order].gt(order)).order(:order).first
  end

  def config
    self[:config]&.with_indifferent_access
  end

  def has_been_launched_by_user?(user)
    launched_stages.for_user(user).present? # &.completed_at.nil?
  end

  def has_been_completed_by_user?(user)
    !launched_stages.for_user(user)&.completed_at.nil?
  end

  def launchable_by_user?(user)
    return true if previous_stage.nil? # first stage is always valid

    prev_launch = previous_stage.launched_stages.for_user(user)
    if prev_launch.nil? || prev_launch.incomplete? # the previous stage will be launched
      return false
    end

    # launch for the user on this stage
    launch = launched_stages.for_user(user)

    # can complete a previous launch, but cannot launch once it's completed
    return launch.incomplete? if launch.present?

    return true if available_after_days.zero? # can be launched immediatly

    # can launch once the days interval is past
    prev_launch.completed_at.before?(available_after_days.days.ago)
  end

  def delayed?
    available_after_days.positive?
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
    launched_stages.for_user(user) || launched_stages.create!(user_id: user.id)
  end

  protected

  def set_order
    self.order = (siblings.maximum(:order) || -1) + 1
  end

end
