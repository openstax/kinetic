# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnerActivityReport do

  let(:study) { create(:study, num_stages: 1) }
  let(:user_id) { SecureRandom.uuid }
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

  before { stub_user_query(accounts_user) }

  def launch_at(time, study_for_launch: study, launching_user_id: user_id)
    Timecop.freeze(time) do
      pad = LaunchPad.new(study_id: study_for_launch.id, user_id: launching_user_id)
      pad.launch
      pad.land
    end
  end

  def rows_for(**args)
    CSV.parse(described_class.new(**args).as_csv_string, headers: true)
  end

  describe 'months_ago' do
    it 'includes launches newer than the given bound' do
      launch_at(2.months.ago)
      expect(rows_for(months_ago: '6').count).to eq 1
    end

    it 'excludes launches older than the given bound' do
      launch_at(9.months.ago)
      expect(rows_for(months_ago: '6').count).to eq 0
    end
  end

  describe 'a range of months' do
    it 'includes only launches that fall inside both bounds' do
      launch_at(6.months.ago, study_for_launch: study)
      inside = rows_for(months_ago: '12-24')
      expect(inside.count).to eq 0

      launch_at(18.months.ago, study_for_launch: create(:study, num_stages: 1))
      expect(rows_for(months_ago: '12-24').count).to eq 1
    end

    it 'excludes launches newer than the near bound' do
      launch_at(3.months.ago)
      expect(rows_for(months_ago: '12-24').count).to eq 0
    end

    it 'excludes launches older than the far bound' do
      launch_at(30.months.ago)
      expect(rows_for(months_ago: '12-24').count).to eq 0
    end

    it 'accepts the bounds in either order' do
      launch_at(18.months.ago)
      expect(rows_for(months_ago: '24-12').count).to eq 1
    end

    it 'tolerates whitespace around the bounds' do
      launch_at(18.months.ago)
      expect(rows_for(months_ago: ' 12 - 24 ').count).to eq 1
    end
  end

  describe 'account lookups' do
    it 'asks accounts for each uuid only once regardless of launch count' do
      other_study = create(:study, num_stages: 1)
      launch_at(2.months.ago, study_for_launch: study)
      launch_at(2.months.ago, study_for_launch: other_study)

      allow(UserInfo).to receive(:for_uuids).and_return({})
      expect(UserInfo).to receive(:for_uuids).with([user_id])

      described_class.new(months_ago: '6').as_csv_string
    end

    it 'does not look up users whose launches fall outside the range' do
      launch_at(2.months.ago)

      allow(UserInfo).to receive(:for_uuids).and_return({})
      expect(UserInfo).to receive(:for_uuids).with([])

      described_class.new(months_ago: '12-24').as_csv_string
    end
  end
end
