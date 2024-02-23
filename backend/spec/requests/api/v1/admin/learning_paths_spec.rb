# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Learning Paths', api: :v1 do
  let(:admin) { create(:admin) }

  let(:valid_attributes) do
    {
      label: 'Cool Path',
      description: 'Cool description'
    }
  end

  let(:invalid_attributes) do
    {
      bad_prop: 'Bad'
    }
  end

  def learning_path_url(learning_path = nil)
    if learning_path.nil?
      'admin/learning_paths'
    else
      "admin/learning_paths/#{learning_path.id}"
    end
  end

  describe 'GET learning paths' do
    it 'renders a successful response' do
      learning_path = LearningPath.create! valid_attributes
      api_get learning_path_url
      expect(response).to have_http_status(:ok)
      expect(response_hash).to match(
        a_hash_including(
          data: array_including(
            a_hash_including(
              id: learning_path.id,
              label: learning_path.label,
              description: learning_path.description
            )
          )
        )
      )
    end
  end

  describe 'POST learning path' do
    context 'with valid parameters' do
      before { stub_current_user(admin) }

      it 'creates a new LearningPath' do
        expect {
          api_post learning_path_url,
                   params: { learning_path: valid_attributes }
        }.to change { LearningPath.count }.by(1)
      end
    end

    context 'with invalid parameters' do
      before { stub_current_user(admin) }

      it 'does not create a new LearningPath' do
        expect {
          api_post learning_path_url,
                   params: { learning_path: invalid_attributes }
        }.not_to change { LearningPath.count }
      end

      it 'renders a JSON response with errors for the new learning_path' do
        api_post learning_path_url,
                 params: { learning_path: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT /update' do
    context 'with valid parameters' do
      before { stub_current_user(admin) }

      let(:new_attributes) do
        {
          label: "New label",
          description: "New description"
        }
      end

      it 'updates the requested learning_path' do
        learning_path = LearningPath.create! valid_attributes
        api_put learning_path_url(learning_path),
                params: { learning_path: new_attributes }

        expect(learning_path.reload.label).to eq new_attributes[:label]
      end

      it 'renders a JSON response with the learning_path' do
        learning_path = LearningPath.create! valid_attributes
        api_put learning_path_url(learning_path),
                params: { learning_path: new_attributes }
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      before { stub_current_user(admin) }

      it 'renders a JSON response with errors for the learning_path' do
        learning_path = LearningPath.create! valid_attributes
        api_put learning_path_url(learning_path),
                params: { learning_path: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE /destroy' do
    before { stub_current_user(admin) }

    it 'destroys the requested learning_path' do
      learning_path = LearningPath.create! valid_attributes
      expect {
        api_delete learning_path_url(learning_path)
      }.to change { LearningPath.count }.by(-1)
    end
  end
end
