# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Misc', type: :request, api: :v1 do

  let(:user_id) { SecureRandom.uuid }
  let(:researcher) { create(:researcher) }
  let(:admin) { create(:admin) }

  describe 'GET /whoami' do
    context 'when no user is logged in' do
      it 'gives the ID and false for roles' do
        get '/api/v1/whoami'
        expect(response_hash).to match(is_administrator: false, is_researcher: false)
      end
    end

    context 'when a user is logged in and not a special role' do
      before { stub_current_user(user_id) }

      it 'gives the ID and false for roles' do
        get '/api/v1/whoami'
        expect(response_hash).to match(user_id: user_id, is_administrator: false, is_researcher: false)
      end
    end

    context 'when an admin is logged in' do
      before { stub_current_user(admin) }

      it 'gives the ID and false for roles' do
        get '/api/v1/whoami'
        expect(response_hash).to match(user_id: admin.user_id, is_administrator: true, is_researcher: false)
      end
    end

    context 'when a researcher is logged in' do
      before { stub_current_user(researcher) }

      it 'gives the ID and false for roles' do
        get '/api/v1/whoami'
        expect(response_hash).to match(user_id: researcher.user_id, is_administrator: false, is_researcher: true)
      end
    end
  end

  describe 'GET /environment' do
    it 'returns the environment' do
      allow(Rails.application.secrets.accounts).to receive(:[]).with(:env_name).and_return 'foo'
      get '/api/v1/environment'
      expect(response_hash).to match({
        accounts_env_name: 'foo',
        homepage_url: 'http://localhost:4000'
      })
    end
  end

end
