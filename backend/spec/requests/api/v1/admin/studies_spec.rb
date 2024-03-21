# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Studies', api: :v1 do
  let(:path) { 'admin/studies' }
  let(:admin) { create(:admin) }
  let!(:study) { create(:study) }

  let(:response_export) { create(:response_export, stage: study.stages.first) }

  describe 'GET' do
    context 'when no or non admin user is logged in' do
      it 'returns unauthorized' do
        api_get "#{path}/all"
        expect(response).to have_http_status(:unauthorized)

        stub_random_user
        api_get "#{path}/all"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when admin user is logged in' do
      before { stub_current_user(admin) }

      it 'returns ok' do
        api_get "#{path}/all"
        expect(response).to have_http_status(:ok)
        expect(response_hash[:data]).not_to be_empty
      end

      it 'returns ok and empty when not found' do
        api_get "#{path}/not-a-status"
        expect(response).to have_http_status(:ok)
        expect(response_hash[:data]).to be_empty
      end

      it 'returns studies awaiting approval' do
        study.submit
        api_get "#{path}/waiting_period"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            data: a_collection_including(
              a_hash_including({
                  title_for_researchers: a_kind_of(String),
                  status: 'waiting_period'
              })
            )
          )
        )
      end

      it 'returns responses for a study' do
        export = response_export
        api_get "admin/study/#{study.id}/responses"
        expect(response).to have_http_status(:ok)
        expect(response_hash[:data]).to match(
          a_collection_including(
            a_hash_including(
              id: export.id
              )
            )
          )
      end
    end
  end

  describe 'POST' do
    before { stub_current_user(admin) }

    let!(:study1) { create(:study) }
    let!(:study2) { create(:study) }
    let!(:study3) { create(:study) }

    it 'approves a study in waiting period' do
      api_post "#{path}/#{study.id}/approve"
      expect(response).to have_http_status(:success)
      expect(response_hash).to match(
        a_hash_including(
          data: []
        )
      )
    end

    it 'marks studies as featured' do
      api_post "#{path}/feature", params: {
        featured_ids: [study2.id, study1.id],
        non_featured_ids: [study3.id]
      }
      [study1, study2, study3].each(&:reload)
      expect(study1.is_featured).to be true
      expect(study2.is_featured).to be true
      expect(study3.is_featured).to be false

      api_post "#{path}/feature", params: {
        featured_ids: [study3.id],
        non_featured_ids: [study1.id, study2.id]
      }
      [study1, study2, study3].each(&:reload)

      expect(study1.is_featured).to be false
      expect(study2.is_featured).to be false
      expect(study3.is_featured).to be true
    end

    it 'marks studies as highlighted' do
      api_post "#{path}/highlight", params: {
        highlighted_ids: [study1.id, study2.id]
      }
      [study1, study2, study3].each(&:reload)
      expect(study1.is_highlighted).to be true
      expect(study2.is_highlighted).to be true
      expect(study3.is_highlighted).to be false

      api_post "#{path}/highlight", params: {
        highlighted_ids: [study3.id]
      }
      [study1, study2, study3].each(&:reload)

      expect(study1.is_highlighted).to be false
      expect(study2.is_highlighted).to be false
      expect(study3.is_highlighted).to be true
    end
  end
end
