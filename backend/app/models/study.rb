# frozen_string_literal: true

class Study < ApplicationRecord
  has_many :study_researchers, dependent: :destroy
  has_many :researchers, through: :study_researchers, dependent: :destroy
  has_many :stages, dependent: :destroy

  # Delete researchers to avoid them complaining about not leaving a researcher undeleted
  before_destroy(prepend: true) { study_researchers.delete_all }

  arel = Study.arel_table

  scope :open, -> { where.not(opens_at: nil).
                    where(arel[:opens_at].lteq(Time.now)).
                    where(arel[:closes_at].eq(nil).or(
                          arel[:closes_at].gteq(Time.now))) }

  def open?
    opens_at && Time.now > opens_at && (closes_at.nil? || Time.now <= closes_at)
  end
end
