# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Reports', api: :v1 do
  let(:path) { 'admin/reports' }
  let(:admin) { create(:admin) }

  let(:study) { create(:study, num_stages: 1) }
  let(:user_id) { SecureRandom.uuid }
  let(:launch_pad) { LaunchPad.new(study_id: study.id, user_id:) }
  let(:task_name) { 'report:activity' }
  let(:accounts_user) do
    {
      id: 1,
      name: 'test test',
      uuid: user_id,
      contact_infos: [
        {
          id: 1,
          type: 'EmailAddress',
          value: 'participant-test@test.com',
          is_guessed_preferred: true,
          is_verified: true
        }
      ]
    }
  end

  describe 'GET learner activity report' do
    before do
      stub_user_query(accounts_user)
      launch_pad.launch
      launch_pad.land
    end

    context 'when no or non admin user is logged in' do
      it 'returns unauthorized' do
        api_get 'admin/reports/learner-activity?months_ago=1'
        expect(response).to have_http_status(:unauthorized)

        stub_random_user
        api_get 'admin/reports/learner-activity?months_ago=1'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when admin user is logged in' do
      before { stub_current_user(admin) }

      it 'returns ok' do
        api_get 'admin/reports/learner-activity?months_ago=1'
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
