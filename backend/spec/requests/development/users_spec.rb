# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Development Users', type: :request do

  before do
    responses_not_exceptions!
    allow(Rails.env).to receive(:development?).and_return(true)
  end

  let(:uuid) { SecureRandom.uuid }

  describe 'ensure_an_admin_exists' do
    it 'adds an admin' do
      put '/development/users/ensure_an_admin_exists'
      expect(response).to have_http_status(:ok)
      expect(Admin.count).to eq 1
    end

    it 'does not add more than one admin' do
      put '/development/users/ensure_an_admin_exists'
      put '/development/users/ensure_an_admin_exists'
      expect(response).to have_http_status(:ok)
      expect(Admin.count).to eq 1
    end
  end

  describe 'users list' do
    let!(:admin) { create(:admin) }
    let!(:researcher) { create(:researcher) }

    it 'works' do
      get '/development/users'
      expect(response).to have_http_status(:ok)
      expect(response_hash.with_indifferent_access).to match(
        a_hash_including(
          researchers: a_collection_containing_exactly(
            { researcher.user_id => { name: researcher.name } }
          ),
          admins: [admin.user_id]
        )
      )
    end
  end

  describe 'log_in & whomai' do
    it 'whoami logged out gives nil' do
      get '/development/users/whoami'
      expect(response_hash).to eq({ user_id: nil })
    end

    it 'allows log in' do
      put "/development/users/#{uuid}/log_in"
      get '/development/users/whoami'
      expect(response_hash).to eq({ user_id: uuid })
    end
  end
end
