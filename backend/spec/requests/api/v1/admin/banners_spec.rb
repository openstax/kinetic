# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Banner', api: :v1 do
  let(:path) { 'admin/banners' }

  let(:admin) { create(:admin) }

  describe 'GET' do
    context 'when no or non admin user is logged in' do
      it 'returns unauthorized' do
        api_get 'admin/banners'
        expect(response).to have_http_status(:unauthorized)

        stub_random_user
        api_get 'admin/banners'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when admin user is logged in' do
      before { stub_current_user(admin) }

      it 'returns ok' do
        api_get path
        expect(response).to have_http_status(:ok)
      end

      it 'returns banners' do
        create(:banner)
        api_get 'admin/banners'
        expect(response_hash).to match(
          a_hash_including(
            data: array_including(
              a_hash_including(
                id: a_kind_of(Integer),
                message: a_kind_of(String),
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

    it 'creates banners' do
      expect {
        api_post path, params: {
          banner: { message: 'a test', start_at: Time.now, end_at: 3.days.from_now }
        }
      }.to change { Banner.count }.by 1
    end
  end

  describe 'PUT' do
    before { stub_current_user(admin) }

    let(:banner) { create(:banner) }

    it 'updates banners' do
      expect {
        api_put "#{path}/#{banner.id}", params: {
          banner: { message: 'a test' }
        }
      }.to change { banner.reload.message }.to('a test')
    end
  end

  describe 'DELETE' do
    before { stub_current_user(admin) }

    let(:banner) { create(:banner) }

    it 'deletes banners' do
      api_delete "#{path}/#{banner.id}"
      expect(Banner.find_by(id: banner.id)).to be_nil
    end
  end
end
