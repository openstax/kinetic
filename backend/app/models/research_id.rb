# frozen_string_literal: true

require 'unique_token'

class ResearchId < ApplicationRecord

  unique_token :id

  def self.for_user_id(user_id)
    find_or_create_by(user_id:)
  end

  def is_freshly_created?
    created_at.is_within?(1.minute.ago)
  end

end
