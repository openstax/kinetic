# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OpenBadgeApi do
  let(:open_badge_api) { described_class.new }

  it 'gets an auth token' do
    token = open_badge_api.authenticate
    expect(token).to be_a(String)
  end

  it 'gets badge info' do
    badge_info = open_badge_api.badge_info('SAJSINa7DGDaC4D')
    expect(badge_info['name']).to be_a(String)
    expect(badge_info['image']).to be_a(String)
  end

end
