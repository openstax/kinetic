# frozen_string_literal: true

require 'rails_helper'

Rails.application.load_tasks

RSpec.describe 'Rake task for activity:report' do

  let(:study) { create(:study, num_stages: 1) }
  let(:study2) { create(:study, num_stages: 1) }
  let(:user_id) { SecureRandom.uuid }
  let(:launch_pad) { LaunchPad.new(study_id: study.id, user_id:) }
  let(:launch_pad2) { LaunchPad.new(study_id: study2.id, user_id:) }
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

  before do
    stub_user_query(accounts_user)
    launch_pad.launch
    launch_pad.land
    launch_pad2.launch
    launch_pad2.land(consent: false)
  end

  it 'generates csv with launch' do
    task = Rake::Task[task_name]
    stdout = capture_stdout do
      task.invoke
    end
    task.reenable

    row = CSV.parse(stdout, headers: true).first
    expect(row['Researcher Title']).to eq study.title_for_researchers
    expect(row['Participant Title']).to eq study.title_for_participants

    # Should only have one record, as we won't include no-consent rows
    expect(CSV.parse(stdout, headers: true).count).to eq 1
  end
end
