# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Study, api: :v1 do

  describe '#open?' do
    let(:study) { create(:study, num_stages: 1) }

    it 'returns open studies' do
      expect_query_results(described_class.available_to_participants, [study])
    end

    it 'doesnt show studies without active stages' do
      study.stages.each { |st| st.update(status: 'completed') }
      expect(described_class.available_to_participants).to be_empty
    end
  end

  describe '#update_stages' do
    let(:study) { create(:study, num_stages: 2) }
    let(:attrs) { study.stages.map(&:as_json) }

    it 'does nothing if no changes' do
      study.update_stages(attrs)
      expect(study.stages.length).to eq attrs.length
      study.stages.each_with_index do |st, i|
        expect(st.as_json).to eq attrs[i]
      end
    end

    it 'adds a stage' do
      update = { points: 100, duration_minutes: 120, config: {} }
      attrs << update
      study.update_stages(attrs)
      expect(study.stages.length).to eq attrs.length
      expect(study.stages.last.as_json).to match(a_hash_including((update.stringify_keys)))
    end

    it 'removes stages' do
      update = [attrs[0]]
      study.update_stages(update)
      expect(study.stages.length).to eq 1
      expect(study.stages[0].as_json).to eq update[0].as_json
    end
  end

  describe '#available?' do
    let!(:opens_and_closes_study) { create(:study, title: 'a') }
    let!(:opens_and_closes_before_study) { create(:study, opens_at: 10.days.ago, closes_at: 3.days.ago, title: 'b') }
    let!(:opens_only_study) { create(:study, closes_at: nil, title: 'c') }
    let!(:opens_later_only_study) { create(:study, opens_at: 3.days.from_now, closes_at: nil, title: 'd') }
    let!(:no_times_study) { create(:study, opens_at: nil, closes_at: nil, title: 'e') }

    let(:scope_studies) { described_class.available_to_participants }
    let(:instance_studies) { Study.all.filter { |study| study.available? } }

    it 'has all available attributes' do
      expect(opens_and_closes_study).to be_available
      expect(opens_and_closes_before_study).not_to be_available
      expect(opens_only_study).to be_available
      expect(opens_later_only_study).not_to be_available
      expect(no_times_study).not_to be_available
    end

    it 'shows same studies for both available methods' do
      expect(scope_studies).to match_array(instance_studies)
    end
  end

  describe '#next_stage_for_user' do
    let(:study) { create(:study, num_stages: 2) }
    let(:user) { User.new('00000000-0000-0000-0000-000000000001') }

    it 'picks a launched but not landed stage' do
      stage = study.stages.first
      stage.launch_by_user!(user)
      expect(study.next_stage_for_user(user)).to eq study.stages.first
    end

    describe 'when prior stage is complete' do
      before do
        study.stages.first.launch_by_user!(user).update!(completed_at: 3.days.ago)
      end

      it 'selects first uncompleted stage' do
        expect(study.next_stage_for_user(user)).to eq study.stages.second
      end

      describe 'when next stage has an availability filter' do
        before do
          study.stages.second.update_attribute(:available_after_days, 5)
        end

        it 'does not launch when not reached' do
          expect(study.next_stage_for_user(user)).to be_nil

          Timecop.freeze(1.days.from_now) do
            expect(study.next_stage_for_user(user)).to be_nil
          end
        end

        it 'launches when time is elapsed' do
          Timecop.freeze(7.days.from_now) do
            expect(study.next_stage_for_user(user)).to eq study.stages.second
          end
        end
      end
    end
  end

  describe 'study status' do
    let!(:researcher) { create(:researcher) }
    let!(:study) { create(:study, num_stages: 3, researchers: researcher) }

    before do
      stub_qualtrics_clone_survey! new_id: '1234'
    end

    it 'submits a study' do
      study.submit
      expect(study.status).to eq 'waiting_period'
      study.stages.each do |stage|
        expect(stage.status).to eq 'waiting_period'
        expect(stage.config['survey_id']).to eq '1234'
      end
    end

    it 'approves a study' do
      study.approve
      expect(study.status).to eq 'ready_for_launch'
      study.stages.each do |stage|
        expect(stage.status).to eq 'ready_for_launch'
      end
    end

    it 'launches a study' do
      study.launch
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'active'
      end
    end

    it 'pauses first session of a study' do
      study.launch
      # Pause first session
      study.pause(0)
      expect(study.status).to eq 'active'
      expect(study.stages.first.status).to eq 'paused'
      expect(study.stages.second.status).to eq 'active'
      expect(study.stages.third.status).to eq 'active'
    end

    it 'pauses second session of a study' do
      study.launch
      # Pause first two sessions
      study.pause(1)
      expect(study.status).to eq 'active'
      expect(study.stages.first.status).to eq 'paused'
      expect(study.stages.second.status).to eq 'paused'
      expect(study.stages.third.status).to eq 'active'
    end

    it 'pauses third session of a study' do
      study.launch
      # Pause all three sessions
      study.pause(2)
      expect(study.status).to eq 'paused'
      expect(study.stages.first.status).to eq 'paused'
      expect(study.stages.second.status).to eq 'paused'
      expect(study.stages.third.status).to eq 'paused'
    end

    it 'resumes a study' do
      study.launch
      study.pause
      study.resume
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'active'
      end

    end

    it 'resumes subsequent studies' do
      study.launch
      study.pause(2)
      expect(study.status).to eq 'paused'

      # Resume first session, should resume all subsequent paused sessions
      study.resume(0)
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'active'
      end
    end

    it 'ends first session' do
      study.launch

      study.end
      expect(study.status).to eq 'active'
      expect(study.stages.first.status).to eq 'completed'
      expect(study.stages.second.status).to eq 'active'
      expect(study.stages.third.status).to eq 'active'
    end

    it 'ends second session' do
      study.launch

      study.end
      study.end
      expect(study.status).to eq 'active'
      expect(study.stages.first.status).to eq 'completed'
      expect(study.stages.second.status).to eq 'completed'
      expect(study.stages.third.status).to eq 'active'
    end

    it 'ends third session' do
      study.launch

      study.end
      study.end
      study.end
      expect(study.status).to eq 'completed'
      expect(study.stages.first.status).to eq 'completed'
      expect(study.stages.second.status).to eq 'completed'
      expect(study.stages.third.status).to eq 'completed'
    end

    it 'reopens a study' do
      study.launch
      study.end
      study.reopen
      expect(study.status).to eq 'active'
      # TODO: with stage index
      study.stages.each do |stage|
        expect(stage.status).to eq 'active'
      end

    end

    it 'reopens subsequent studies' do
      study.launch
      study.end
      study.end
      study.end

      # Reopen first session, should resume all subsequent completed sessions
      expect(study.status).to eq 'completed'
      study.reopen(0)
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'active'
      end
    end
  end

  def expect_query_results(query, results)
    expect(query.all.map(&:title_for_researchers)).to contain_exactly(
      *results.map(&:title_for_researchers)
    )
  end
end
