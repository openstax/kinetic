require 'rails_helper'


Rails.application.load_tasks

RSpec.describe "Rake task for activity:report" do

  let(:study) { create(:study, num_stages: 1) }
  let(:user_id) { SecureRandom.uuid }
  let(:launch_pad) { LaunchPad.new(study_id: study.id, user_id: user_id) }
  let(:task_name) { 'report:activity' }

  before do
    launch_pad.launch
    launch_pad.land
  end

  it "executes" do
    stdout = StringIO.new
    $stdout = stdout
    Rake::Task[task_name].invoke
    $stdout = STDOUT
    Rake.application[task_name].reenable
    rows = CSV.parse(stdout.string)

    expect(rows[0][1]).to eq 'Participant Title'
    expect(rows[0][2]).to eq 'Researcher Title'
    expect(rows[1][1]).to eq study.title_for_participants
    expect(rows[1][2]).to eq study.title_for_researchers
  end
end
