# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Environment', api: :v1 do

  let(:user_id) { SecureRandom.uuid }

  describe 'fetch' do
    context 'when no user is logged in' do
      it 'rejects the request' do
        get '/api/v1/preferences'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with a new user' do
      before { stub_current_user(user_id) }

      it 'returns default preferences' do
        expect {
          get '/api/v1/preferences'
        }.to not_change { UserPreferences.count }
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            cycle_deadlines_email: false,
            prize_cycle_email: false,
            session_available_email: true,
            study_available_email: false
          )
        )
      end
    end

    context 'with an existing user' do
      before { stub_current_user(user_id) }

      it 'returns their saved preferences' do
        UserPreferences.create!(user_id: user_id, cycle_deadlines_email: true)
        get '/api/v1/preferences'
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            cycle_deadlines_email: true,
            prize_cycle_email: false,
            session_available_email: true,
            study_available_email: false
          )
        )
      end

    end
  end

  describe 'update' do
    context 'when no user is logged in' do
      it 'rejects the request' do
        post '/api/v1/preferences', params: { preferences: { cycle_deadlines_email: false } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with an existing user' do
      before { stub_current_user(user_id) }

      it 'updates' do
        expect {
          post '/api/v1/preferences', params: { preferences: { cycle_deadlines_email: false } }
          expect(response).to have_http_status(:accepted)
        }.to change { UserPreferences.count }.by(1)
        expect(UserPreferences.for_user_id(user_id).cycle_deadlines_email).to be false

        post '/api/v1/preferences', params: { preferences: { cycle_deadlines_email: true } }
        expect(UserPreferences.for_user_id(user_id).cycle_deadlines_email).to be true
      end

    end
  end

end
