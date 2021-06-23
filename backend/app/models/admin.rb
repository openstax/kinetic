# frozen_string_literal: true

class Admin < ApplicationRecord
  validates :user_id, uuid: true, uniqueness: true
end
