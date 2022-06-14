# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Participant Studies', type: :request, api: :v1, multi_stage: true do

  let!(:closed_study) { create(:study, num_stages: 2, closes_at: 1.day.ago) }

  let!(:study1) { create(:study, num_stages: 2) }
  let(:stage1a) { study1.stages.order(:order)[0] }
  let(:stage1b) { study1.stages.order(:order)[1] }

  let!(:study2) { create(:study, num_stages: 2) }
  let(:stage2a) { study2.stages.order(:order)[0] }
  let(:stage2b) { study2.stages.order(:order)[1] }

  let!(:study3) { create(:study, num_stages: 1) }
  let(:stage3a) { study3.stages.order(:order)[0] }

  let(:user1_id) { SecureRandom.uuid }

  let(:user1_study1_launch_pad) { LaunchPad.new(study_id: study1.id, user_id: user1_id) }
  let(:user1_study2_launch_pad) { LaunchPad.new(study_id: study2.id, user_id: user1_id) }
  let(:user1_study3_launch_pad) { LaunchPad.new(study_id: study3.id, user_id: user1_id) }

  before do
    responses_not_exceptions!

    # One new study (#1), one in progress (#2), one complete (#3)
    user1_study2_launch_pad.launch_url
    user1_study3_launch_pad.launch_url
    user1_study3_launch_pad.land
  end

  describe 'GET participant/studies/{id}' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "participant/studies/#{study1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in' do
      before { stub_current_user(user1_id) }

      it 'returns a launched study study' do
        api_get "participant/studies/#{study2.id}"
        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          id: study2.id,
          title: study2.title_for_participants,
          short_description: study2.short_description,
          tags: study2.tags,
          duration_minutes: study2.duration_minutes,
          researchers: a_collection_containing_exactly(
            {
              name: study2.researchers.first.name,
              institution: kind_of(String),
              bio: kind_of(String)
            }
          ),
          first_launched_at: kind_of(String)
        )
      end

      it 'errors for unlaunched closed studies' do
        api_get "participant/studies/#{closed_study.id}"
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an open unlaunched study' do
        api_get "participant/studies/#{study2.id}"
        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          id: study2.id,
          first_launched_at: kind_of(String)
        )
      end
    end
  end

  describe 'GET participant/studies' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get 'participant/studies'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in' do
      before { stub_current_user(user1_id) }

      it 'return studies' do
        api_get 'participant/studies'
        expect(response).to have_http_status(:success)
        expect(response_hash[:data]).to match a_collection_containing_exactly(
          a_hash_including(
            id: study1.id,
            title: study1.title_for_participants,
            short_description: study1.short_description,
            tags: study1.tags,
            duration_minutes: study1.duration_minutes,
            researchers: a_collection_containing_exactly(
              {
                name: kind_of(String),
                institution: kind_of(String),
                bio: kind_of(String)
              }
            )
          ),
          a_hash_including(
            id: study2.id,
            title: study2.title_for_participants,
            short_description: study2.short_description,
            tags: study2.tags,
            duration_minutes: study2.duration_minutes,
            researchers: a_collection_containing_exactly(
              {
                name: study2.researchers.first.name,
                institution: kind_of(String),
                bio: kind_of(String)
              }
            ),
            first_launched_at: kind_of(String)
          ),
          a_hash_including(
            id: study3.id,
            first_launched_at: kind_of(String),
            completed_at: kind_of(String)
          )
        )
      end
    end
  end

  describe 'PUT participants/studies/{id}/launch' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "participant/studies/#{study1.id}/launch"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in' do
      before { stub_current_user(user1_id) }

      it 'gives the next stage launch URL for an incomplete study' do
        api_put "participant/studies/#{study1.id}/launch"
        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          url: /#{stage1a.config[:url]}.*/
        )
      end

      it 'launches next stage for a multi-part' do
        stage1a.launch_by_user!(User.new(user1_id)).completed!

        api_put "participant/studies/#{study1.id}/launch"
        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          url: /#{stage1b.config[:url]}.*/
        )
      end

      it 'does not give an error for a complete study' do
        api_put "participant/studies/#{study3.id}/launch"
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT participants/studies/{id}/land' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "participant/studies/#{study2.id}/land"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in' do
      before { stub_current_user(user1_id) }

      it 'returns completion status for a multistage study' do
        stage1a.launch_by_user!(User.new(user1_id))
        # expect_any_instance_of(LaunchPad).to receive(:land)
        api_put "participant/studies/#{study1.id}/land"
        expect(response_hash[:completed_at]).to be_nil

        stage1b.launch_by_user!(User.new(user1_id))
        Timecop.freeze do
          api_put "participant/studies/#{study1.id}/land"
          expect(response_hash[:completed_at]).not_to be_nil
          expect(DateTime.parse(response_hash[:completed_at])).to be_within(1.second).of DateTime.now
        end
      end

      context 'when aborting early' do
        it 'does not mark complete' do
          allow_any_instance_of(LaunchPad).to(
            receive(:abort)
              .with('refusedconsent')
              .and_return(true)
          )

          expect_any_instance_of(LaunchedStage).not_to receive(:completed!)
          api_put "participant/studies/#{study3.id}/land", params: {
            aborted: 'refusedconsent'
          }
          expect(response).to have_http_status(:ok)
        end

      end

      it 'works for a launched study not yet landed' do
        allow_any_instance_of(LaunchPad).to receive(:land).and_return({})
        expect {
          api_put "participant/studies/#{study2.id}/land?md[foo]=bar&md[bar]=baz"
        }.to change { ParticipantMetadatum.count }.by 1
        expect(response).to have_http_status(:success)
        md = ParticipantMetadatum.where(study_id: study2.id).first
        expect(md).not_to be_nil
        expect(md.metadata).to eq({ 'foo' => 'bar', 'bar' => 'baz' })
      end

      it 'gives an error for a complete study' do
        api_put "participant/studies/#{study3.id}/land"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match a_hash_including(completed_at: kind_of(String))
      end
    end
  end
end
