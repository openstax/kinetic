# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Eligibility', api: :v1 do
  it 'defaults to true' do
    get '/api/v1/eligibility'
    expect(response_hash).to include(eligible: true)
  end

  context 'with book slug' do
    it 'is true for random books' do
      get '/api/v1/eligibility', params: { book: 'an-unknown-book' }
      expect(response_hash).to include(eligible: true)
    end

    it 'is false for disallowed books' do
      get '/api/v1/eligibility', params: { book: Kinetic::NON_ELIGIBLE_BOOKS.first }
      expect(response_hash).to include(eligible: false)
    end
  end

  context 'with geolocation' do
    it 'is true for US' do
      get '/api/v1/eligibility', headers: { 'CloudFront-Viewer-Country' => 'US' }
      expect(response_hash).to include(eligible: true)
    end

    it 'is true for NON-US codes' do
      get '/api/v1/eligibility', headers: { 'CloudFront-Viewer-Country' => 'BAD' }
      expect(response_hash).to include(eligible: false)
    end
  end

  context 'with book and geolocation' do
    it 'is false if only partially valid' do
      get '/api/v1/eligibility',
          params: { book: 'an-unknown-book' },
          headers: { 'CloudFront-Viewer-Country' => 'BAD' }
      expect(response_hash).to include(eligible: false)

      get '/api/v1/eligibility',
          params: { book: Kinetic::NON_ELIGIBLE_BOOKS.first },
          headers: { 'CloudFront-Viewer-Country' => 'US' }
      expect(response_hash).to include(eligible: false)
    end
  end
end
