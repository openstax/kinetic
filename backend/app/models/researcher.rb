# frozen_string_literal: true

class Researcher < ApplicationRecord
  has_many :study_researchers
  has_many :studies, -> { distinct }, through: :study_researchers, inverse_of: :researchers

  has_many :analysis_researchers
  has_many :analysis, through: :analysis_researchers, inverse_of: :researchers
  enum role: [:member, :pi, :lead], _default: 'member'

  has_one_attached :avatar

  validates :user_id, uuid: true, uniqueness: true

  def avatar_url
    return unless avatar.attached?

    resized_avatar = avatar.variant(resize_to_fill: [125, 125]).processed
    Rails.application.routes.url_helpers.url_for(resized_avatar)
  end
end
