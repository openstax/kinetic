# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Reward', type: :request, api: :v1 do
  let(:path) { 'admin/rewards' }

  let(:admin) { create(:admin) }

  describe 'GET' do
    context 'when no or non admin user is logged in' do
      it 'returns unauthorized' do
        api_get 'admin/rewards'
        expect(response).to have_http_status(:unauthorized)

        stub_random_user
        api_get 'admin/rewards'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when admin user is logged in' do
      before { stub_current_user(admin) }

      it 'returns ok' do
        api_get path
        expect(response).to have_http_status(:ok)
      end

      it 'returns rewards' do
        create(:reward)
        api_get 'admin/rewards'
        expect(response_hash).to match(
          a_hash_including(
            data: array_including(
              a_hash_including(
                id: a_kind_of(Integer),
                points: a_kind_of(Integer),
                prize: a_kind_of(String),
                start_at: a_kind_of(String),
                end_at: a_kind_of(String)
              )
            )
          )
        )
      end
    end

  end

  describe 'POST' do
    before { stub_current_user(admin) }

    it 'creates rewards' do
      expect {
        api_post path, params: {
          reward: { prize: 'a test', points: 1, start_at: Time.now, end_at: 3.days.from_now }
        }
      }.to change { Reward.count }.by 1
    end
  end

  describe 'PUT' do
    before { stub_current_user(admin) }

    let(:reward) { create(:reward) }

    it 'updates rewards' do
      expect {
        api_put "#{path}/#{reward.id}", params: {
          reward: { prize: 'a test' }
        }
      }.to change { reward.reload.prize }.to('a test')
    end
  end

  describe 'DELETE' do
    before { stub_current_user(admin) }

    let(:reward) { create(:reward) }

    it 'deletes rewards' do
      api_delete "#{path}/#{reward.id}"
      expect(Reward.find_by(id: reward.id)).to be_nil
    end
  end
end
