# frozen_string_literal: true

module Api::V1::Admin
  class BaseController < Api::V1::BaseController
    before_action :render_unauthorized_unless_admin!, except: [:stop]
  end
end
