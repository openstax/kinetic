# frozen_string_literal: true

class Study < ApplicationRecord
  has_many :study_researchers, inverse_of: :study, dependent: :destroy
  has_many :researchers, through: :study_researchers, dependent: :destroy
  # need the double quotes, order is a postgresql semi-reserved word
  has_many :stages, -> { order('"order"') }, inverse_of: :study, dependent: :destroy
  has_many :launched_stages, through: :stages
  has_many :launched_studies

  has_many :response_exports, through: :stages
  has_many :study_analysis
  has_many :analysis, through: :study_analysis

  has_one :first_launched_study, -> { order 'first_launched_at asc' }, class_name: 'LaunchedStudy'

  has_one :pi,
          -> {
            joins(:study_researchers).where(researchers: { study_researchers: { role: 'pi' } })
          },
          foreign_key: 'study_researchers.study_id',
          class_name: 'Researcher'
  has_one :lead,
          -> {
            joins(:study_researchers).where(researchers: { study_researchers: { role: 'lead' } })
          },
          foreign_key: 'study_researchers.study_id',
          class_name: 'Researcher'

  has_many :members,
           -> {
             joins(:study_researchers).where(researchers: { study_researchers: { role: 'member' } })
           },
           foreign_key: 'study_researchers.study_id',
           class_name: 'Researcher'

  # Delete researchers to avoid them complaining about not leaving a researcher undeleted
  before_destroy(prepend: true) { study_researchers.delete_all }

  arel = Study.arel_table

  scope :multi_stage, -> { joins(:stages).group('studies.id').having('count(study_id) > 1') }

  scope :available_to_participants, -> {
    where
      .not(opens_at: nil)
      .where(is_hidden: false)
      .where(arel[:opens_at].lteq(Time.now))
      .where(arel[:closes_at].eq(nil).or(
               arel[:closes_at].gteq(Time.now)))
  }

  scope :public_to_researchers, -> {
    where
      .not(public_on: nil)
      .where('public_on < ?', DateTime.now)
  }

  def status
    stages.last&.status || 'draft'
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

  def update_stages(updated_stages)
    return if updated_stages.nil? || launched_stages.any?

    # remove any extra stages that were removed
    stages.delete(stages.last) while stages.count > updated_stages.count

    updated_stages.each_with_index do |stage, i|
      s = stages[i]
      if s.present?
        s.update!(stage.to_hash)
      else
        stages.create!(stage.to_hash)
      end
    end
  end

  def is_featured?
    featured_ids = Rails.application.secrets.fetch(:featured_studies, [])
    featured_ids.any? && stages.any? { |st| featured_ids.include?(st.config['survey_id']) }
  end

  def is_demographic_survey?
    stages.any? do |stage|
      stage.config['survey_id'] == Rails.application.secrets.demographic_survey_id
    end
  end

  def is_syllabus_contest_study?
    contest_ids = Rails.application.secrets.fetch(:syllabus_contest_studies, [])
    contest_ids.any? && stages.any? { |st| contest_ids.include?(st.config['survey_id']) }
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

  def launch
    stages.update_all(status: 'active')
  end

  def approve
    stages.update_all(status: 'ready_for_launch')
  end

  def submit
    (survey_id, secret_key) = CloneSurvey.new.clone(title_for_researchers)
    stages.each do |stage|
      stage.update!(
        {
          status: 'waiting_period',
          config: {
            type: 'qualtrics',
            survey_id: survey_id,
            secret_key: secret_key
          }
        }
      )
    end
  end

  def pause(stage_index=0)
    stages.first(stage_index.to_i + 1).each do |stage|
      stage.update!(status: 'paused')
    end
  end

  def resume(stage_index=0)
    stages.last(stages.length - stage_index.to_i).each do |stage|
      stage.update!(status: 'active')
    end
  end

  def end
    stages.where.not(status: 'completed').first&.update!(status: 'completed')
  end

  def reopen(stage_index=0)
    stages.last(stages.length - stage_index.to_i).each do |stage|
      stage.update!(status: 'active')
    end
  end

  def reopen_if_possible
    return if stages.any? { |stage| stage.status != 'completed' }
    return if target_sample_size.present? && completed_count >= target_sample_size
    return if closes_at.present? && closes_at <= DateTime.now

    reopen
  end

  # called from studies controller to update status using action and stage_index from params
  def update_status!(action, stage_index)
    if %w[end launch].include?(action)
      send(action)
    elsif %w[resume pause reopen].include?(action)
      send(action, stage_index)
    elsif action == 'submit'
      submit
      ResearcherNotifications.notify_kinetic_study_review(self)
    else
      raise ArgumentError, "Invalid action: #{action}"
    end
    save!
  end
end
