# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OpenBadgeApi do
  let(:open_badge_api) { described_class.new }

  it 'gets an auth token' do
    open_badge_api.authenticate
  end

end
