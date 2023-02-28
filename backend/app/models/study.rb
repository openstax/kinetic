# frozen_string_literal: true

class Study < ApplicationRecord
  # list of fields to set to nil when they're ommited in an api udpate
  NULLABLE_FIELDS = %w[opens_at closes_at].freeze
  has_many :study_researchers, inverse_of: :study, dependent: :destroy
  has_many :researchers, through: :study_researchers, dependent: :destroy
  # need the double quotes, order is a postgresql semi-reserved word
  has_many :stages, -> { order('"order"') }, inverse_of: :study, dependent: :destroy
  has_many :launched_stages, through: :stages
  has_many :launched_studies, counter_cache: true

  has_many :study_analysis
  has_many :analysis, through: :study_analysis

  has_one  :first_launched_study, -> { order 'first_launched_at asc' }, class_name: 'LaunchedStudy'

  scope :multi_stage, -> { joins(:stages).group('studies.id').having('count(study_id) > 1') }

  # Delete researchers to avoid them complaining about not leaving a researcher undeleted
  before_destroy(prepend: true) { study_researchers.delete_all }

  enum status: [:draft, :active, :paused, :scheduled, :completed]

  arel = Study.arel_table

  scope :available, -> {
    where
      .not(opens_at: nil)
      .where(is_hidden: false)
      .where(arel[:opens_at].lteq(Time.now))
      .where(arel[:closes_at].eq(nil).or(
               arel[:closes_at].gteq(Time.now)))
  }

  def status
    if %w[draft paused scheduled].include? status
      status
    elsif !opens_at.nil? && opens_at > DateTime.now
      'draft'
    elsif !closes_at.nil? && closes_at < DateTime.now
      'completed'
    else
      'active'
    end
  end

  def total_points
    stages.sum(:points)
  end

  def total_duration
    stages.sum(:duration_minutes)
  end

  def available?
    !is_hidden? && opens_at && Time.now > opens_at && (closes_at.nil? || Time.now <= closes_at)
  end

  def can_delete?
    launched_studies.none?
  end

  def launched_count
    launched_studies.size
  end

  def is_featured?
    featured_ids = Rails.application.secrets.fetch(:featured_studies, [])
    featured_ids.any? && stages.any? { |st| featured_ids.include?(st.config['survey_id']) }
  end

  def next_launchable_stage(user)
    launched_stage_ids = launched_stages.where(user_id: user.id).complete.pluck(:stage_id)
    stages
      .where.not(id: launched_stage_ids)
      .order(:order)
      .find { |stage| stage.launchable_by_user?(user) }
  end

  def next_stage_for_user(user)
    launches = launched_stages.where(user_id: user.id)
    incomplete_launch = launches.find(&:incomplete?)

    return incomplete_launch.stage if incomplete_launch.present?

    next_launchable_stage(user)
  end

end
