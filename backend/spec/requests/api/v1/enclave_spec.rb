# frozen_string_literal: true

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

      context 'run failed' do
        it 'sends a failed notice' do
          run.messages.create({ stage: 'archive', level: 'info', message: 'something' })
          expect {
            api_put 'enclave/runs/completion', params: { api_key: run.api_key, status: 'failure', error: 'a bad thing happened' }
            expect(run.messages.last.message).to eq 'a bad thing happened'
          }.to change { AnalysisRunMessage.count }.by(1)
          expect(run.reload.finished_at).not_to be_nil

          email = ActionMailer::Base.deliveries.last
          expect(email.subject).to match 'Your analysis has failed'
        end

        it 'sends a completion notice' do
          api_put 'enclave/runs/completion', params: { api_key: run.api_key, status: 'success' }
          expect(run.reload.finished_at).not_to be_nil
          email = ActionMailer::Base.deliveries.last
          expect(email.subject).to match 'Your analysis has completed'
        end
      end
    end

  end

end
