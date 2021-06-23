# frozen_string_literal: true

class Stage < ApplicationRecord
  belongs_to :study

  before_create :set_return_id, :set_order

  protected

  def set_order
    self.order = (Stage.maximum(:order) || -1) + 1
  end

  def set_return_id
    self.return_id = SecureRandom.alphanumeric
  end
end
