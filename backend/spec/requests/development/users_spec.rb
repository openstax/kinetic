# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Development Users' do

  before do
    responses_not_exceptions!
    allow(Rails.env).to receive(:development?).and_return(true)
  end

  let(:uuid) { SecureRandom.uuid }

  describe 'ensure_users_exist' do
    it 'adds an admin and researcher' do
      put '/development/users/ensure_users_exist'
      expect(response).to have_http_status(:ok)
      expect(Admin.count).to eq 1
      expect(Researcher.count).to eq 1
    end

    it 'does not add more than one user' do
      put '/development/users/ensure_users_exist'
      put '/development/users/ensure_users_exist'
      expect(response).to have_http_status(:ok)
      expect(Admin.count).to eq 1
    end
  end

  describe 'users list' do
    let!(:admin) { create(:admin) }
    let!(:researcher) { create(:researcher) }

    it 'returns all users' do
      get '/development/users'
      expect(response).to have_http_status(:ok)
      expect(response_hash.with_indifferent_access).to match(
        a_hash_including(
          'researchers' => a_collection_containing_exactly(
            a_hash_including({
              user_id: researcher.user_id,
              first_name: researcher.first_name
            })
          ),
          'admins' => a_collection_including(
            a_hash_including({
              user_id: admin.user_id
            })
          )
        )
      )
    end
  end

  describe 'log_in' do
    it 'allows log in' do
      put "/development/users/#{uuid}/log_in"
      expect(response).to have_http_status(:ok)
    end
  end
end
