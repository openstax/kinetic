# frozen_string_literal: true

require 'rails_helper'

Rails.application.load_tasks

RSpec.describe 'Rake task for activity:report' do

  let(:study) { create(:study, num_stages: 1) }
  let(:user_id) { SecureRandom.uuid }
  let(:launch_pad) { LaunchPad.new(study_id: study.id, user_id: user_id) }
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

  let(:mock_reply) { OpenStruct.new(response: OpenStruct.new(body: { items: [accounts_user] }.to_json)) }

  before do
    launch_pad.launch
    launch_pad.land
  end

  it 'generates csv with launch' do
    allow(OpenStax::Accounts::Api).to receive(:search_accounts).and_return(mock_reply)

    task = Rake::Task[task_name]
    stdout = capture_stdout do
      task.invoke
    end
    task.reenable

    row = CSV.parse(stdout, headers: true).first
    expect(row['Researcher Title']).to eq study.title_for_researchers
    expect(row['Participant Title']).to eq study.title_for_participants
    expect(row['Email']).to eq accounts_user[:contact_infos].first[:value]
  end
end
