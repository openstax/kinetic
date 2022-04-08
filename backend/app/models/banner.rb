# frozen_string_literal: true

class Banner < ApplicationRecord

  scope :active, -> {
    where('start_at <= :now AND end_at >= :now', { now: Time.now })
  }

end
