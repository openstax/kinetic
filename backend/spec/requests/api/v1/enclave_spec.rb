require 'rails_helper'

RSpec.describe 'Enclave', api: :v1 do
  let(:researcher) { create(:researcher) }
  let(:analysis) { create(:analysis, researchers: [researcher]) }
  let(:api_key) { Rails.application.secrets.enclave_api_key }
  let(:run) { analysis.runs.create(message: 'testing, not resting') }

  describe 'create' do
    context 'without api key' do
      before { stub_current_user(create(:admin)) }

      it 'returns unauthorized' do
        api_post 'enclave/runs'
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'with api key and analysis' do
      before do
        set_header('Authorization', "Bearer #{Rails.application.secrets.enclave_api_key}")
      end

      it 'creates a run' do
        expect {
          api_post 'enclave/runs', params: { analysis_id: analysis.id, message: 'some code to test' }
          expect(response).to have_http_status(:created)
          expect(response_hash).to match(
            a_hash_including(
              api_key: a_kind_of(String),
              analysis_id: analysis.id,
              analysis_api_key: analysis.api_key
            )
          )
        }.to change { AnalysisRun.count }.by(1)
      end

      it 'adds a log' do
        expect {
          api_post 'enclave/runs/log', params: { api_key: run.api_key, stage: 'review', level: 'info', message: 'some code to test' }
        }.to change { AnalysisRunMessage.count }.by(1)
      end

      it 'sends a completion notice' do
        api_put 'enclave/runs/notify', params: { api_key: run.api_key, status: 'failure' }
        expect(run.reload.finished_at).not_to be_nil

        email = ActionMailer::Base.deliveries.last
        expect(email.subject).to match 'Your analysis has failed'
      end
    end
  end

end
