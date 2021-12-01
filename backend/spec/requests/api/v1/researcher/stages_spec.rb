# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Stages', type: :request, api: :v0 do

  before { responses_not_exceptions! }

  let(:other_researcher) { create(:researcher) }
  let(:original_researcher) { create(:researcher) }
  let(:original_researchers) { [original_researcher] }
  let(:study) { create(:study, researchers: original_researchers) }

  describe 'add a stage to a study' do
    let(:path) { "researcher/studies/#{study.id}/stages" }

    let(:valid_new_stage_attributes) do
      {
        config: {
          type: 'qualtrics',
          url: 'https://foo.com',
          secret_key: 'abcdefg'
        }
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher not on the study' do
      before { stub_current_user(other_researcher) }

      it 'gives forbidden' do
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher on the study' do
      before { stub_current_user(original_researcher) }

      it 'works for the first stage' do
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:created)
        expect(study.stages.reload).not_to be_empty
        expect(response_hash).to match(
          a_hash_including(
            order: 0,
            config: valid_new_stage_attributes[:config]
          )
        )
      end

      it 'disallows a second stage for the moment' do
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:created)
        api_post path, params: { stage: valid_new_stage_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(study.stages.reload.count).to eq 1
      end
    end
  end

  describe 'get a stage' do
    let(:stage) { create(:stage, study: study) }
    let(:path) { "researcher/stages/#{stage.id}" }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_get path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher not on the study' do
      before { stub_current_user(other_researcher) }

      it 'gives forbidden' do
        api_get path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher on the study' do
      before { stub_current_user(original_researcher) }

      it 'works' do
        api_get path
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            order: 0,
            config: a_hash_including(type: 'qualtrics')
          )
        )
      end
    end
  end

  describe 'update a stage' do
    let(:stage) { create(:stage, study: study) }
    let(:path) { "researcher/stages/#{stage.id}" }
    let(:valid_changes) do
      {
        config: {
          type: 'qualtrics',
          url: 'https://foo.com',
          secret_key: 'abcdefg'
        }
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_put path, params: { stage: valid_changes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_put path, params: { stage: valid_changes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher not on the study' do
      before { stub_current_user(other_researcher) }

      it 'gives forbidden' do
        api_put path, params: { stage: valid_changes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher on the study' do
      before { stub_current_user(original_researcher) }

      it 'works with good data' do
        api_put path, params: { stage: valid_changes }
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(
            order: 0,
            config: valid_changes[:config]
          )
        )
      end

      it 'fails when try to update read-only fields' do
        expect {
          api_put path, params: { stage: { order: 42 } }
        }.not_to change { stage.reload.order }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'remove a stage from a study' do
    let(:stage) { create(:stage, study: study) }
    let(:path) { "researcher/stages/#{stage.id}" }

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
      before { stub_current_user(other_researcher) }

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
        expect(study.stages.reload).to be_empty
      end
    end
  end

end
