# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Impersonate', api: :v1 do
  let(:admin) { create(:admin) }
  let(:researcher) { create(:researcher) }

  describe 'POST' do
    context 'when admin is logged in' do
      before { stub_current_user(admin) }

      it 'can impersonate a researcher' do
        api_post "admin/impersonate/researcher/#{researcher.id}"
        expect(session[:impersonating]).to eq researcher.user_id
        expect(response).to have_http_status(:ok)
      end

      it 'can access the impersonated researchers data' do

      end

      it 'can stop impersonating' do
        api_post "admin/impersonate/stop"
        expect(session).to match(hash_excluding(:impersonating))
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
