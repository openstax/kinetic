# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Study Researchers', type: :request, api: :v1 do

  before { responses_not_exceptions! }

  let(:other_researcher) { create(:researcher) }
  let(:original_researcher) { create(:researcher) }
  let(:original_researchers) { [original_researcher] }
  let(:study) { create(:study, researchers: original_researchers) }

  describe 'add a researcher to a study' do
    let(:new_researcher) { create(:researcher) }
    let(:path) { "researcher/studies/#{study.id}/researcher/#{new_researcher.user_id}" }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher not on the study' do
      before { stub_current_user(other_researcher) }

      it 'gives forbidden' do
        api_post path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher on the study' do
      before { stub_current_user(original_researcher) }

      it 'works' do
        api_post path
        expect(response).to have_http_status(:created)
        expect(study.researchers.reload).to include(new_researcher)
      end
    end
  end

  describe 'remove a researcher from a study' do
    let(:yet_another_researcher) { create(:researcher) }
    let(:original_researchers) { [original_researcher, other_researcher] }
    let(:path) { "researcher/studies/#{study.id}/researcher/#{original_researcher.user_id}" }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_delete path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_delete path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher not on the study' do
      before { stub_current_user(yet_another_researcher) }

      it 'gives forbidden' do
        api_delete path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher on the study' do
      before { stub_current_user(original_researcher) }

      it 'works' do
        api_delete path
        expect(response).to have_http_status(:ok)
        expect(study.researchers.reload).not_to include(original_researcher)
      end
    end

    context 'when there is only one researcher left' do
      let(:original_researchers) { [original_researcher] }

      before { stub_current_user(original_researcher) }

      it 'does not allow deletion' do
        api_delete path
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_hash[:messages]).to include(/is the last researcher/)
        expect(study.researchers.reload).to include(original_researcher)
      end
    end
  end
end
