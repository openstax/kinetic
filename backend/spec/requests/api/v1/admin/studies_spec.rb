# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Studies', api: :v1 do
  let(:path) { 'admin/studies' }
  let(:admin) { create(:admin) }
  let!(:study) { create(:study, stages: [create(:stage, status: :waiting_period)]) }

  describe 'GET' do
    context 'when no or non admin user is logged in' do
      it 'returns unauthorized' do
        api_get 'admin/studies'
        expect(response).to have_http_status(:unauthorized)

        stub_random_user
        api_get 'admin/studies'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when admin user is logged in' do
      before { stub_current_user(admin) }

      it 'returns ok' do
        api_get path
        expect(response).to have_http_status(:ok)
      end

      it 'returns studies awaiting approval' do
        api_get 'admin/studies'
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            data: a_collection_containing_exactly(
              a_hash_including({
                title_for_researchers: a_kind_of(String),
                status: 'waiting_period'
              })
            )
          )
        )
      end
    end
  end

  describe 'POST' do
    before { stub_current_user(admin) }

    it 'approves a study in waiting period' do
      api_post "#{path}/#{study.id}/approve"
      expect(response).to have_http_status(:success)
      expect(response_hash).to match(
        a_hash_including(
          data: []
        )
      )
    end
  end
end
