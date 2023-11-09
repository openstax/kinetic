# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study, inverse_of: :stages

  has_many :response_exports, inverse_of: :stage

  has_many :launches, class_name: 'LaunchedStage', foreign_key: :stage_id

  self.implicit_order_column = 'order'

  has_many :launched_stages do
    def for_user(user)
      where(user_id: user.id).first
    end
  end

  has_many :siblings, -> (stage) {
    query = where(study_id: stage.study_id)
    query.where.not(id: stage.id) if stage.persisted?
    query
  }, class_name: 'Stage', foreign_key: 'study_id', primary_key: 'study_id'

  before_create :set_order

  enum status: [:draft, :active, :paused, :scheduled,
                :waiting_period, :ready_for_launch, :completed],
       _default: 'draft'

  def status
    s = read_attribute(:status)

    return 'paused' if s == 'paused'
    return 'completed' if completed?
    return 'scheduled' if scheduled?
    return s if draft_like?
    return 'active' if active?

    s
  end

  def draft_like?
    s = read_attribute(:status)
    %w[draft waiting_period ready_for_launch].include?(s)
  end

  def completed?
    s = read_attribute(:status)
    return true if s == 'completed'

    if study.target_sample_size.present? && (study.completed_count >= study.target_sample_size)
      return true
    end

    days_until_close = previous_stages.count * available_after_days
    !study.closes_at.nil? && (study.closes_at.next_day(days_until_close)) < DateTime.now
  end

  def scheduled?
    study.opens_at.present? && study.opens_at > DateTime.now
  end

  def active?
    study.opens_at.present? && study.opens_at < DateTime.now
  end

  def previous_stages
    siblings.where(Stage.arel_table[:order].lt(order)).order(:order)
  end

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
    launched_stages.for_user(user) || launched_stages.create!(user_id: user.id)
  end

  protected

  def set_order
    self.order = (siblings.maximum(:order) || -1) + 1
  end

end
