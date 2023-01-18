# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Stage, multi_stage: true do
  let(:study1) { create(:study, num_stages: 2) }
  let(:study2) { create(:study, num_stages: 2) }

  it 'tracks order within a study' do
    expect(study1.stages.map(&:order).sort).to eq [0, 1]
    expect(study2.stages.map(&:order).sort).to eq [0, 1]
  end
end
