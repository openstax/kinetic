# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResearchId do
  describe '#for_user_id' do
    it 'generates an id' do
      rid = described_class.for_user_id(SecureRandom.uuid)
      expect(rid.id.length).to be 16
    end
  end
end
