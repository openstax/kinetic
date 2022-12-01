# frozen_string_literal: true

require 'rails_helper'
require 'csv'

RSpec.describe QualtricsTestData do
  let(:survey_id) { 'SV_6xGQzj4OBJnxGuy' } # demographic survey
  let(:study) { create(:study, num_stages: 1) }
  let(:stage) { study1.stages.first }

  let(:secret_key) { 'faY0ccV2dtF19TMS' }

  let(:data) { JSON.parse(File.read(Rails.root.join('spec', 'support', 'qualtrics_fake_response.json'))) }

  before do
    study.stages.first.update!(config: { type: 'qualtrics', survey_id: survey_id })
  end

  it 'generates a CSV' do
    allow(StudyResponseExport).to receive(:new_random_seed).and_return(42)
    allow_any_instance_of(QualtricsApi).to(
      receive(:get)
        .with("survey-definitions/#{survey_id}")
        .and_return(data)
    )
    expect {
      study.fetch_responses(is_testing: true)
    }.to change { study.study_response_exports.count }.by(1)
    exp = study.study_response_exports.last
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
