# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Analysis', api: :v1 do

  let(:researcher1) { create(:researcher) }
  let(:researcher2) { create(:researcher) }

  let(:study1) { create(:study) }
  let(:study2) { create(:study) }
  let(:study3) { create(:study) }

  describe 'POST researcher/analysis' do
    let(:valid_new_analysis_attributes) do
      {
        title: 'Participant analysis title',
        repository_url: 'https://github.com/openstax/kinetic.git',
        description: 'A short description',
        study_ids: [study1.id, study2.id, study3.id]
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post 'researcher/analysis', params: { analysis: valid_new_analysis_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post 'researcher/analysis', params: { analysis: valid_new_analysis_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before { stub_current_user(researcher1) }

      it 'sets the attributes' do
        api_post 'researcher/analysis', params: { analysis: valid_new_analysis_attributes }
        expect(response).to have_http_status(:created)
        expect(response_hash).to match(
          a_hash_including(
            valid_new_analysis_attributes
          )
        )
      end
    end
  end

  describe 'GET researcher/analysis' do

    context 'when logged out' do
      let(:analysis1) { create(:analysis, researchers: researcher1) }

      it 'gives unauthorized' do
        api_get "researcher/analysis/#{analysis1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      let(:analysis1) { create(:analysis, researchers: researcher1) }

      before { stub_random_user }

      it 'gives forbidden' do
        api_get "researcher/analysis/#{analysis1.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      let!(:owned_analysis) { create(:analysis, researchers: researcher1) }
      let!(:other_analysis) { create(:analysis, researchers: researcher2) }

      before do
        stub_current_user(researcher1)
      end

      it 'returns only the analysis owned by the calling researcher' do
        api_get 'researcher/analysis'
        expect(response).to have_http_status(:success)

        expect(response_hash[:data]).not_to match a_collection_containing_exactly(
          a_hash_including(id: other_analysis.id)
        )

        expect(response_hash[:data]).to match a_collection_containing_exactly(
          a_hash_including(id: owned_analysis.id)
        )

      end
    end
  end

  describe 'PATCH researcher/analysis' do
    let(:analysis1) { create(:analysis, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "researcher/analysis/#{analysis1.id}", params: { analysis: { title: 'hacked!' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        expect {
          api_put "researcher/analysis/#{analysis1.id}", params: { analysis: { title: 'hacked!' } }
        }.to not_change { analysis1.reload; analysis1.title }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'updates the analysis' do
        api_put "researcher/analysis/#{analysis1.id}", params: { analysis: { title: 'updated' } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(title: 'updated')
        )
      end

      it 'cannot blank required fields' do
        expect {
          api_put "researcher/analysis/#{analysis1.id}",
                  params: { analysis: { title: '' } }
        }.not_to change { analysis1.reload.title }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST researcher/analysis/:id/run/:run_id' do
    let(:analysis) { create(:analysis, researchers: [researcher1]) }
    let(:run) { create(:analysis_run, analysis: analysis) }

    before { stub_current_user(researcher1) }

    it 'updates the status' do
      expect {
        api_put "researcher/analysis/#{run.analysis.id}/run/#{run.id}", params: { run: { status: 'canceled' } }
      }.to change { run.reload.status }.from('pending').to('canceled')
      expect(response).to have_http_status(:ok)
    end
  end

end
