# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Researchers', api: :v1 do
  let(:researcher1) { create(:researcher) }
  let(:researcher2) {FactoryBot.create(:researcher)}

  let(:valid_researcher_attributes) do
    {
      name: 'Researcher McResearcherson',
      user_id: '00000000-0000-0000-0000-000000000001',
      bio: 'Pretty cool person who does things and also doesnt do things',
      institution: 'Fake University U',
      lab_page: 'https://google.com',
      research_interest_1: 'Rock Climbing',
      research_interest_2: 'Photography',
      research_interest_3: 'Animal Behavior',
    }
  end

  describe 'GET researchers/{id}' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "researchers/#{researcher1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a researcher' do
      before {stub_current_user(researcher1)}

      it 'gets the researcher by id' do
        api_get "researchers/#{researcher1.id}"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(a_hash_including(id: researcher1.id))
      end
    end
  end

  describe 'GET researchers' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "researchers"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH researchers/{id}' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "researchers/#{researcher1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        expect {
          api_put "researchers/#{researcher1.id}", params: { researcher: valid_researcher_attributes }
        }.not_to change { researcher1.reload; researcher1.name }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when logged in as the researcher' do
      before {stub_current_user(researcher2)}

      it 'updates a researcher' do
        api_put "researchers/#{researcher2.id}", params: { researcher: valid_researcher_attributes }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(a_hash_including(name: "Researcher McResearcherson"))
      end

      it 'updates a researchers avatar' do

      end
    end
  end

  describe 'DELETE researchers/{id}' do

  end
end
