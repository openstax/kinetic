# frozen_string_literal: true

class ParticipantMetadatum < ApplicationRecord
  belongs_to :study

  def readonly?
    !new_record?
  end

  def before_destroy
    raise ActiveRecord::ReadOnlyRecord
  end
end
