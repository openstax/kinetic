# frozen_string_literal: true

class LaunchedStage < ApplicationRecord
  belongs_to :stage

  before_create { self.first_launched_at ||= Time.now }
end
