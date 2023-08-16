# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Impersonate', api: :v1 do
  let(:admin) { create(:admin) }
  let(:researcher) { create(:researcher) }

  describe 'POST' do
    context 'when admin is logged in' do
      before { stub_current_user(admin) }

      it 'can impersonate a researcher' do
        api_get "admin/impersonate/researcher/#{researcher.id}"
        expect(session[:impersonating]).to eq researcher.user_id
        expect(response).to redirect_to(Rails.application.secrets.frontend_url)
      end

      it 'can stop impersonating' do
        api_get 'admin/impersonate/stop'
        expect(session).to match(hash_excluding(:impersonating))
        expect(response).to redirect_to("#{Rails.application.secrets.frontend_url}/admin/impersonate")
      end
    end
  end
end
