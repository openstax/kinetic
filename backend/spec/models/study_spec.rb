# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Study do
  let!(:opens_and_closes_study) { create(:study, title: 'a') }
  let!(:opens_and_closes_before_study) { create(:study, opens_at: 10.days.ago, closes_at: 3.days.ago, title: 'b') }
  let!(:opens_only_study) { create(:study, closes_at: nil, title: 'c') }
  let!(:opens_later_only_study) { create(:study, opens_at: 3.days.from_now, closes_at: nil, title: 'd') }
  let!(:no_times_study) { create(:study, opens_at: nil, closes_at: nil, title: 'e') }

  describe '#open?' do
    it 'returns open studies' do
      expect_query_results(described_class.available, [opens_and_closes_study, opens_only_study])
    end
  end

  describe '#available?' do
    it 'has all available attributes' do
      expect(opens_and_closes_study).to be_available
      expect(opens_and_closes_before_study).not_to be_available
      expect(opens_only_study).to be_available
      expect(opens_later_only_study).not_to be_available
      expect(no_times_study).not_to be_available
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

  def expect_query_results(query, results)
    expect(query.all.map(&:title_for_researchers)).to contain_exactly(
      *results.map(&:title_for_researchers)
    )
  end
end
