# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OpenBadgeApi do
  let(:open_badge_api) { described_class.new }

  it 'gets an auth token' do
    token = open_badge_api.authenticate
    expect(token).to be_a_kind_of(String)
  end

  it 'gets badge info' do
    open_badge_api.badge_info('SAJS8Va7DGDaC3D')
  end

end
