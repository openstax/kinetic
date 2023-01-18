# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LaunchPad, multi_stage: true do

  let(:study1) { create(:study, num_stages: 2) }
  let(:stage1a) { study1.stages.order(:order)[0] }
  let(:stage1b) { study1.stages.order(:order)[1] }

  let(:study2) { create(:study, num_stages: 1) }
  let(:stage2a) { study2.stages.order(:order)[0] }

  let(:user1_id) { SecureRandom.uuid }
  let(:user2_id) { SecureRandom.uuid }

  let(:user1_study1_launch_pad) { described_class.new(study_id: study1.id, user_id: user1_id) }
  let(:user1_study2_launch_pad) { described_class.new(study_id: study2.id, user_id: user1_id) }
  let(:user2_study2_launch_pad) { described_class.new(study_id: study2.id, user_id: user2_id) }

  before do
    # Start another studies with our user of interest and another user to test our queries
    user1_study2_launch_pad.launch_url
    user2_study2_launch_pad.launch_url
  end

  context 'when a researcher previews a study' do
    let(:url) { user1_study1_launch_pad.launch_url(preview: true) }

    it 'appends preview query params' do
      expect(url).to match(/Q_CHL=preview/)
    end

    it 'does not record launch' do
      expect {
        user1_study1_launch_pad.launch_url(preview: true)
      }.to not_change { LaunchedStudy.count }
       .and not_change { LaunchedStage.count }
       .and not_change { ResearchId.count }
    end
  end

  context 'when a user has done no stages' do
    it 'launches the first stage' do
      url = nil
      expect {
        url = user1_study1_launch_pad.launch_url
      }.to change { LaunchedStudy.count }.by(1)
       .and change { LaunchedStage.count }.by(1)

      expect(url).to match(/ssotoken=/)
    end

    it 'does not error if the user tries to land multiple times' do
      expect { user1_study1_launch_pad.land }.not_to raise_error
    end
  end

  context 'when a user has launched the first stage' do
    before { user1_study1_launch_pad.launch_url }

    it 'will launch the first stage again' do
      url = nil
      expect {
        url = user1_study1_launch_pad.launch_url
      }.to not_change { LaunchedStudy.count }
       .and not_change { LaunchedStage.count }
       .and not_change { ResearchId.count }

      expect(url).to match(/ssotoken=/)
    end

    it 'can land the first stage' do
      expect {
        user1_study1_launch_pad.land
      }.to not_change { LaunchedStudy.complete.count }
       .and change { LaunchedStage.complete.count }.by(1)
    end
  end

  context 'when a user has done one stage' do
    before do
      user1_study1_launch_pad.launch_url
      user1_study1_launch_pad.land
    end

    it 'launches the second stage' do
      url = nil
      expect {
        url = user1_study1_launch_pad.launch_url
      }.to not_change { LaunchedStudy.count }
       .and change { LaunchedStage.count }.by(1)

      expect(url).to match(/ssotoken=/)
    end
  end

  context 'when a user has completed a study' do
    before do
      user1_study1_launch_pad.launch_url
      user1_study1_launch_pad.land
      user1_study1_launch_pad.launch_url
      user1_study1_launch_pad.land
    end

    it 'raises an error on launch' do
      expect {
        user1_study1_launch_pad.launch_url
      }.to raise_error(LaunchError)
    end
  end

end
