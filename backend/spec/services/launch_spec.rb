# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Launch do

  around(:each) do |example|
    ENV['ALLOW_MULTIPLE_STAGES'] = 'true'
    example.run
    ENV['ALLOW_MULTIPLE_STAGES'] = 'false'
  end

  let!(:stage1) { create(:stage) }
  let!(:study) { stage1.study }
  let!(:stage2) { create(:stage, study: study) }
  let(:user_id) { SecureRandom.uuid }
  let(:instance) { Launch.new(study_id: study.id, user_id: user_id) }

  context 'when a user has done no stages' do
    it 'launches the first stage' do
      url = nil
      expect {
        url = instance.do_it
      }.to change { LaunchedStudy.count }.by(1)
       .and change { LaunchedStage.count }.by(1)

      expect(url).to match(/^#{stage1.config[:url]}\?ssotoken=.*/)
    end
  end

  context 'when a user has done one stage' do
    before do
      Launch.new(study_id: study.id, user_id: user_id).do_it
    end

    it 'launches the second stage' do
      url = nil
      expect {
        url = instance.do_it
      }.to change { LaunchedStudy.count }.by(0)
       .and change { LaunchedStage.count }.by(1)

      expect(url).to match(/^#{stage2.config[:url]}\?ssotoken=.*/)
    end
  end

  context 'when a user has completed a study' do
    before do
      Launch.new(study_id: study.id, user_id: user_id).do_it
      Launch.new(study_id: study.id, user_id: user_id).do_it
    end

    it 'raises an error on launch' do
      expect {
        Launch.new(study_id: study.id, user_id: user_id).do_it
      }.to raise_error(LaunchError)
    end
  end



  # context 'when a user has done one stage' do
  #   it 'launches the second stage' do
  #     debugger
  #     debugger
  #   end
  # end



end
