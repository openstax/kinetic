# frozen_string_literal: true

class Researcher < ApplicationRecord
  has_many :study_researchers
  has_many :studies, through: :study_researchers, inverse_of: :researchers

  has_many :analysis_researchers
  has_many :analysis, through: :analysis_researchers, inverse_of: :researchers

  has_one_attached :avatar

  validates :user_id, uuid: true, uniqueness: true

  def avatar_url
    return unless avatar.attached?

    Rails.application.routes.url_helpers.url_for(avatar)
  end
end
