# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Study, api: :v1 do
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

  describe 'update study status' do
    let(:admin) { create(:admin) }
    let(:researcher) { create(:researcher) }
    let(:study) { create(:study, num_stages: 3, researchers: researcher) }
    let(:path) { "researcher/studies/#{study.id}/update_status" }

    it 'submits a study' do
      study.submit
      expect(study.status).to eq 'waiting_period'
      study.stages.each do |stage|
        expect(stage.status).to eq 'waiting_period'
      end
    end

    it 'approves a study' do
      study.approve
      expect(study.status).to eq 'ready_for_launch'
      study.stages.each do |stage|
        expect(stage.status).to eq 'ready_for_launch'
      end
    end

    it 'pauses a study (first session)' do
      study.pause
      expect(study.status).to eq 'paused'
      expect(study.stage.first.status).to eq 'paused'
      expect(study.stages[1].status).to eq 'active'
    end

    it 'resumes a study' do
      study.resume
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'paused'
      end
    end

    it 'ends a study' do
      study.end
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'paused'
      end
    end

    it 'reopens a study' do
      study.reopen
      expect(study.status).to eq 'active'
      study.stages.each do |stage|
        expect(stage.status).to eq 'paused'
      end
    end

    # it 'updates the study\'s status to completed' do
    #   api_put "researcher/studies/#{study1.id}", params: { study: { status: 'completed' } }
    #
    #   expect(response).to have_http_status(:success)
    #   expect(response_hash).to match(a_hash_including(status: 'completed'))
    # end
    #
    # it 'updates the study\'s status to scheduled' do
    #   api_put "researcher/studies/#{study1.id}", params: { study: { status: 'scheduled' } }
    #
    #   expect(response).to have_http_status(:success)
    #   expect(response_hash).to match(a_hash_including(status: 'scheduled'))
    # end
    #
    # it 'updates the study\'s status to active' do
    #   api_put "researcher/studies/#{study1.id}", params: { study: { status: 'active' } }
    #
    #   expect(response).to have_http_status(:success)
    #   expect(response_hash).to match(a_hash_including(status: 'active'))
    # end

    # Unneeded, can't revert to draft
    # it 'updates the study\'s status to draft' do
    #   api_put "researcher/studies/#{study1.id}", params: { study: { status: 'draft' } }
    #
    #   expect(response).to have_http_status(:success)
    #   expect(response_hash).to match(a_hash_including(status: 'draft'))
    # end
    #

  end

  def expect_query_results(query, results)
    expect(query.all.map(&:title_for_researchers)).to contain_exactly(
      *results.map(&:title_for_researchers)
    )
  end
end
