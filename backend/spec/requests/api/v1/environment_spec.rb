# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Environment', api: :v1 do

  let(:user_id) { '00000000-0000-0000-0000-000000000002' }
  let(:researcher) { create(:researcher) }
  let(:admin) { create(:admin) }

  describe 'GET /' do
    context 'when no user is logged in' do
      it 'gives the ID and false for roles' do
        get '/api/v1/environment'
        expect(response_hash[:user]).to be_empty
      end
    end

    context 'when a user is logged in and not a special role' do
      before { stub_current_user(user_id) }

      it 'gives the ID and false for roles' do
        get '/api/v1/environment'
        expect(response_hash[:user]).to include(user_id:, is_administrator: false, is_researcher: false)
      end
    end

    context 'when an admin is logged in' do
      before { stub_current_user(admin) }

      it 'gives the ID and false for roles' do
        get '/api/v1/environment'
        expect(response_hash[:user]).to include(user_id: admin.user_id, is_administrator: true, is_researcher: false)
      end
    end

    context 'when a researcher is logged in' do
      before { stub_current_user(researcher) }

      it 'gives the ID and false for roles' do
        get '/api/v1/environment'
        expect(response_hash[:user]).to include(user_id: researcher.user_id, is_administrator: false, is_researcher: true)
      end
    end

    it 'returns the environment' do
      get '/api/v1/environment'
      expect(response_hash).to include({
        accounts_env_name: 'dev',
        homepage_url: 'http://localhost:4000',
        rewards_schedule: a_kind_of(Array),
        banners_schedule: a_kind_of(Array)
      })
    end
  end

end
