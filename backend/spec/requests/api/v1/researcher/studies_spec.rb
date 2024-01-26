# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Studies', api: :v1 do

  let(:researcher1) { create(:researcher) }
  let(:researcher2) { create(:researcher) }
  let(:researcher3) { create(:researcher) }
  let(:researcher4) { create(:researcher) }

  describe 'POST researcher/studies' do
    let(:valid_new_study_attributes) do
      {
        title_for_participants: 'Participant study title',
        title_for_researchers: 'Researcher study title',
        internal_description: 'For researchers only',
        short_description: 'A short description',
        long_description: 'A longer description',
        category: 'Research',
        topic: 'Learning',
        subject: 'Biology',
        benefits: 'Some benefit to society',
        image_id: 'Schoolfuturecareer_1',
        stages: [
          {
            points: 10,
            duration_minutes: 5,
            feedback_types: ['Debrief, Personalized'],
            config: {
              type: 'qualtrics',
              survey_id: 'SV_12QHR3BE',
              secret_key: '1234567890123456'
            }
          }
        ]
      }
    end

    context 'when logged out' do
      it 'gives unauthorized' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before do
        stub_current_user(researcher1)
      end

      let!(:study_with_stages) { create(:study, researchers: researcher1) }

      it 'successfully creates a new study' do
        api_post 'researcher/studies', params: { study: valid_new_study_attributes }
        expect(response).to have_http_status(:created)
        expect(response_hash).to match(
          a_hash_including(
            title_for_participants: 'Participant study title',
            return_url: kind_of(String),
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher1.user_id
              )
            ),
            stages: a_collection_including(
              a_hash_including(
                points: 10
              )
            )
          )
        )
      end

      it 'submits the study for review' do
        api_post "researcher/studies/#{study_with_stages.id}/update_status?status_action=submit"
        expect(response).to have_http_status(:success)
        expect(response_hash).to match(a_hash_including(
                                         stages: a_collection_containing_exactly(
                                           a_hash_including({ status: 'waiting_period' })
                                         )
        ))
      end

      it 'launches the study and the study status should be active' do
        api_post "researcher/studies/#{study_with_stages.id}/update_status?status_action=launch",
                 params: { study: { opens_at: 1.day.ago } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(
            stages: a_collection_containing_exactly(
              a_hash_including({
                status: 'active'
              })
            )
          )
        )
      end

      it 'launches the study and the study status should be scheduled' do
        api_post "researcher/studies/#{study_with_stages.id}/update_status?status_action=launch",
                 params: { study: { opens_at: 1.day.from_now } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(
            stages: a_collection_containing_exactly(
              a_hash_including({
                status: 'scheduled'
              })
            )
          )
        )
      end

      it 'ends and reopens study' do
        api_post "researcher/studies/#{study_with_stages.id}/update_status?status_action=end"

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(
            stages: a_collection_containing_exactly(
              a_hash_including({
                status: 'completed'
              })
            )
          )
        )

        api_put "researcher/studies/#{study_with_stages.id}", params: { study: {
          opens_at: 1.day.ago,
          closes_at: 10.days.from_now
        } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(
            stages: a_collection_containing_exactly(
              a_hash_including({
                status: 'active'
              })
            )
          )
        )
      end

      it 'fails to reopen a completed study that cannot re-open' do
        study_with_stages.launch
        study_with_stages.end
        study_with_stages.update_attribute(:opens_at, 2.days.ago)
        study_with_stages.update_attribute(:closes_at, 1.day.ago)

        api_put "researcher/studies/#{study_with_stages.id}", params: { study: {
          closes_at: 1.day.ago
        } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(status: 'completed')
        )
      end
    end
  end

  describe 'GET researcher/studies' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before do
        create(:study, researchers: researcher1)
        create(:study, researchers: researcher2)
        stub_current_user(researcher1)
      end

      it 'returns only the studies owned by the calling researcher' do
        api_get 'researcher/studies'
        expect(response).to have_http_status(:success)
        expect(response_hash[:data]).to match a_collection_containing_exactly(
          a_hash_including(
            return_url: kind_of(String),
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher1.user_id
              )
            )
          )
        )
      end
    end
  end

  describe 'GET researcher/public_studies' do
    context 'when logged out' do
      it 'gives unauthorized' do
        api_get 'researcher/public_studies'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get 'researcher/public_studies'
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed in as a researcher' do
      before do
        create(:study, researchers: researcher1)
        create(:study, researchers: researcher4, public_on: 3.days.ago)
        stub_current_user(researcher1)
      end

      it 'returns all owned and public studies' do
        api_get 'researcher/public_studies'
        expect(response).to have_http_status(:success)
        expect(response_hash[:data]).to match a_collection_including(
          a_hash_including(
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher1.user_id
              )
            )
          ),
          a_hash_including(
            researchers: a_collection_including(
              a_hash_including(
                user_id: researcher4.user_id
              )
            )
          )
        )
      end

    end
  end

  describe 'PUT researcher/study' do
    let(:study1) { create(:study, researchers: researcher1) }
    let(:study2) { create(:study, researchers: [researcher1], title_for_researchers: 'Researcher add/drop') }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_put "researcher/studies/#{study1.id}", params: { study: { title_for_researchers: 'Test' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        expect {
          api_put "researcher/studies/#{study1.id}", params: { study: { title_for_researchers: 'Test' } }
        }.not_to change { study1.reload; study1.title_for_researchers }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed as the owning researcher' do
      before do
        stub_current_user(researcher1)
        stub_user_query
      end

      it 'updates the study' do
        api_put "researcher/studies/#{study1.id}", params: { study: { title_for_researchers: 'Test' } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match(
          a_hash_including(title_for_researchers: 'Test')
        )
      end

      it 'updates the study researchers' do
        researcher1.update_attribute(:role, 'member')
        researcher2.update_attribute(:role, 'pi')
        researcher3.update_attribute(:role, 'lead')
        api_put "researcher/studies/#{study1.id}", params: { study: { researchers: [
          researcher1,
          researcher2,
          researcher3
        ] } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          researchers: a_collection_containing_exactly(
            a_hash_including({
              id: researcher1.id,
              bio: researcher1.bio,
              role: researcher1.role
            }),
            a_hash_including({
              id: researcher2.id,
              bio: researcher2.bio,
              role: researcher2.role
            }),
            a_hash_including({
              id: researcher3.id,
              bio: researcher3.bio,
              role: researcher3.role
            })
          )
        )
      end

      it 'adds new study researchers' do
        # Add a Lead and PI
        researcher1.update_attribute(:role, 'member')
        researcher2.update_attribute(:role, 'lead')
        researcher4.update_attribute(:role, 'pi')
        api_put "researcher/studies/#{study2.id}", params: { study: { researchers: [
          researcher1,
          researcher2,
          researcher4
        ] } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          researchers: a_collection_containing_exactly(
            a_hash_including({
              id: researcher1.id,
              bio: researcher1.bio,
              role: researcher1.role
            }),
            a_hash_including({
              id: researcher2.id,
              bio: researcher2.bio,
              role: researcher2.role
            }),
            a_hash_including({
              id: researcher4.id,
              bio: researcher4.bio,
              role: researcher4.role
            })
          )
        )
      end

      it 'replaces an existing study PI' do
        # Add a Lead and PI
        researcher1.update_attribute(:role, 'member')
        researcher2.update_attribute(:role, 'lead')
        researcher4.update_attribute(:role, 'pi')
        api_put "researcher/studies/#{study2.id}", params: { study: { researchers: [
          researcher1,
          researcher2,
          researcher4
        ] } }

        researcher3.update_attribute(:role, 'pi')
        api_put "researcher/studies/#{study2.id}", params: { study: { researchers: [
          researcher1,
          researcher2,
          researcher3
        ] } }

        expect(response).to have_http_status(:success)
        expect(response_hash).to match a_hash_including(
          researchers: a_collection_containing_exactly(
            a_hash_including({
              id: researcher1.id,
              bio: researcher1.bio,
              role: researcher1.role
            }),
            a_hash_including({
              id: researcher2.id,
              bio: researcher2.bio,
              role: researcher2.role
            }),
            a_hash_including({
              id: researcher3.id,
              bio: researcher3.bio,
              role: researcher3.role
            })
          )
        )
      end

      it 'cannot blank required fields' do
        expect {
          api_put "researcher/studies/#{study1.id}", params: { study: { internal_description: '' } }
        }.not_to change { study1.internal_description }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE researcher/study' do
    let!(:study1) { create(:study, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:unauthorized)
        expect(study1).not_to be_destroyed
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:forbidden)
        expect(study1).not_to be_destroyed
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'hides the study' do
        api_delete "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:ok)
        expect(study1.reload.is_hidden).to be(true)
        expect(study1).not_to be_destroyed
      end
    end
  end

  describe 'GET researcher/study' do
    let!(:study1) { create(:study, researchers: researcher1) }

    context 'when logged out' do
      it 'gives unauthorized' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in as a non-researcher' do
      before { stub_random_user }

      it 'gives forbidden' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when signed as the owning researcher' do
      before { stub_current_user(researcher1) }

      it 'deletes the study' do
        api_get "researcher/studies/#{study1.id}"
        expect(response).to have_http_status(:ok)
        expect(response_hash).to match(
          a_hash_including(id: study1.id)
        )
      end
    end
  end
end
