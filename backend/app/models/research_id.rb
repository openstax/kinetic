# frozen_string_literal: true

require 'unique_token'

class ResearchId < ApplicationRecord

  unique_token :id

  def self.for_user_id(user_id)
    find_or_create_by(user_id:)
  end

  def is_new_user?(date=Date.today)
    created_at.after?(date - 1.day)
  end

end
