# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Researcher::Responses', api: :v1 do
  let(:analysis) { create(:analysis) }
  let(:study) { create(:study, num_stages: 1) }
  let(:response_export) { create(:response_export, stage: study.stages.first) }

  context 'with invalid api key' do
    it 'gives not found' do
      api_get 'researcher/responses/bad-api-key'
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'GET researcher/responses/<key>' do

    it 'returns empty array when no stages exists' do
      api_get "researcher/responses/#{analysis.api_key}"
      expect(response).to have_http_status(:ok)
      expect(response_hash[:response_urls]).to be_empty
    end

    it 'returns file for each stage' do
      analysis.studies << response_export.stage.study
      analysis.save!

      expect(analysis.stages).not_to be_empty
      api_get "researcher/responses/#{analysis.api_key}"
      expect(response).to have_http_status(:ok)
      expect(response_hash[:response_urls]).to include match response_export.files.first.blob.filename.to_s
    end

  end

  describe 'GET researcher/responses/<key>/info' do
    it 'returns empty array when no stages exists' do
      api_get "researcher/responses/#{analysis.api_key}/info"
      expect(response).to have_http_status(:ok)
      expect(response_hash[:info_urls]).to be_empty
    end

    it 'returns url for each analysis upload' do
      analysis.studies << response_export.stage.study
      analysis.save!
      analysis.stages.first.analysis_infos.attach(io: File.open(__FILE__), filename: 'spec.rb', content_type: 'text/plain')
      api_get "researcher/responses/#{analysis.api_key}/info"
      expect(response_hash[:info_urls].size).to eq 1
    end
  end

end
