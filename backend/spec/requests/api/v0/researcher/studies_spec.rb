# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Studies', type: :request, api: :v0 do

  let(:researcher1) { create(:researcher) }
  let(:researcher2) { create(:researcher) }

  describe 'POST researcher/studies' do
    let(:valid_new_study_attributes) do
      {
        title_for_participants: 'Participant study title',
        title_for_researchers: 'Researcher study title',
        short_description: 'A short description',
        long_description: 'A longer description',
        category: 'research_study',
        duration_minutes: 10
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before { stub_current_user(researcher1) }

      it 'works' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:created)
        expect(response_hash).to match(
          a_hash_including(
            title_for_participants: 'Participant study title',
            return_url: kind_of(String),
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher1.user_id
              )
            )
          )
        )
      end
    end
  end

  describe 'GET researcher/studies' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before do
        create(:study, researchers: researcher1)
        create(:study, researchers: researcher2)
        stub_current_user(researcher1)
      end

      it 'returns only the studies owned by the calling researcher' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:success)
        expect(response_hash[:data]).to match a_collection_containing_exactly(
          a_hash_including(
            return_url: kind_of(String),
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher1.user_id
              )
            )
          )
        )
      end
    end
  end

  describe 'PATCH researcher/study' do
    let!(:study1) { create(:study, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "researcher/studies/#{study1.id}", params: { study: { duration_minutes: 2 } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        expect {
          api_put "researcher/studies/#{study1.id}", params: { study: { duration_minutes: 2 } }
        }.not_to change { study1.reload; study1.duration_minutes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'updates the study' do
        api_put "researcher/studies/#{study1.id}", params: { study: { duration_minutes: 2 } }
        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(duration_minutes: 2)
        )
      end

      it 'cannot blank required fields' do
        expect {
          api_put "researcher/studies/#{study1.id}",
                  params: { study: { title_for_participants: '' } }
        }.not_to change { study1.title_for_participants }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'cannot set funky category' do
        expect {
          api_put "researcher/studies/#{study1.id}",
                  params: { study: { category: 'howdy' } }
        }.not_to change { study1.reload; study1.category }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE researcher/study' do
    let!(:study1) { create(:study, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:unauthorized)
        expect(study1).not_to be_destroyed
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:forbidden)
        expect(study1).not_to be_destroyed
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'deletes the study' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:ok)
        expect(study1).to be_destroyed
      end
    end
  end

  describe 'GET researcher/study' do
    let!(:study1) { create(:study, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'deletes the study' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(id: study1.id)
        )
      end
    end
  end
end
