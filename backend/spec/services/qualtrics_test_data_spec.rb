# frozen_string_literal: true

require 'rails_helper'
require 'csv'

RSpec.describe QualtricsTestData do
  let(:survey_id) { 'SV_6xGQzj4OBJnxGuy' } # demographic survey
  let(:study) { create(:study, num_stages: 1) }
  let(:analysis) { create(:analysis) }
  let(:stage) { study1.stages.first }

  let(:secret_key) { 'faY0ccV2dtF19TMS' }

  before do
    stub_qualtrics_survey_definition!
    analysis.studies << study
    study.stages.first.update!(config: { type: 'qualtrics', survey_id: survey_id })
  end

  it 'generates a CSV' do
    allow(ResponseExport).to receive(:new_random_seed).and_return(42)

    expect {
      study.stages.first.response_exports.create!(is_testing: true, cutoff_at: Date.today)
    }.to change { study.response_exports.count }.by(1)
    exp = study.response_exports.last
    expect(exp.metadata).to eq('random_seed' => 42)
    fn = exp.files.last.filename
    expect(fn.extension).to eq 'csv'
    csv = CSV.new(exp.files.last.download).read

    expect(csv.length).to eq 51
    expect(csv[0]).to eq(%w[
                           first-gen lunches kinetic_source
                           consent_form grade zip employed
                           gender language year race
                         ])
    expect(csv[6]).to eq([
                           'Neither of my parents attended college', 'Yes', 'From email', 'I consent',
                           'High school diploma', '98687', 'Retired', 'Female', 'English', '7674',
                           'American Indian or Alaska Native'
                         ])
  end
end
