# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V0::Researcher::StudiesController, type: :request, api: :v0 do

  let(:researcher1) { create(:researcher) }

  describe 'POST researcher/studies' do

    let(:valid_new_study_attributes) do
      {
        name_for_participants: "Participant study name",
        name_for_researchers: "Researcher study name",
        description_for_participants: "Participant study description",
        description_for_researchers: 'Researcher study description',
        category: 'research_study',
        duration_minutes: 10
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post 'researcher/studies', params: valid_new_study_attributes
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post 'researcher/studies', params: valid_new_study_attributes
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before { stub_current_user(researcher1) }

      it 'works' do
        api_post 'researcher/studies', params: valid_new_study_attributes
        expect(response).to have_http_status(:created)
      end
    end


  end

end
