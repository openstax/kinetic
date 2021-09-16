# frozen_string_literal: true

class ResearchId < ApplicationRecord

  unique_token :id

  def self.for_user_id(user_id)
    find_or_create_by(user_id: user_id)
  end
end
