# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Researchers', api: :v1 do
  let(:researcher1) { create(:researcher) }
  let(:researcher2) { create(:researcher) }

  describe 'GET researchers/<id>' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "researcher/#{researcher1.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a different researcher' do
      before {stub_current_user(researcher2)}

      it 'gives forbidden' do
        api_get "researcher/#{researcher1.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as the owning researcher' do
      it 'gets the current researcher' do
        api_get "researcher/#{researcher1.id}"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(a_hash_including(id: researcher1.id))
      end
    end
  end

  describe 'GET researchers' do

  end

  describe 'POST researchers' do

  end
end
