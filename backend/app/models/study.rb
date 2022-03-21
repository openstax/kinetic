# frozen_string_literal: true

class Study < ApplicationRecord
  # list of fields to set to nil when they're ommited in an api udpate
  NULLABLE_FIELDS = %w[opens_at closes_at].freeze
  has_many :study_researchers, dependent: :destroy
  has_many :researchers, through: :study_researchers, dependent: :destroy
  # need the double quotes, order is a postgresql semi-reserved word
  has_many :stages, -> { order('"order"') }, dependent: :destroy
  has_many :launched_stages, through: :stages
  has_many :launched_studies

  has_one  :first_launched_study, -> { order 'first_launched_at asc' }, class_name: 'LaunchedStudy'

  # Delete researchers to avoid them complaining about not leaving a researcher undeleted
  before_destroy(prepend: true) { study_researchers.delete_all }

  arel = Study.arel_table

  scope :available, -> {
    where
      .not(opens_at: nil)
      .where(arel[:opens_at].lteq(Time.now))
      .where(arel[:closes_at].eq(nil).or(
               arel[:closes_at].gteq(Time.now)))
  }

  def available?
    opens_at && Time.now > opens_at && (closes_at.nil? || Time.now <= closes_at)
  end

  def can_delete?
    launched_studies.none?
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
