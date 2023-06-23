# frozen_string_literal: true

module MockingHelpers
  def mock_qualtrics_survey_definition!(result=nil)
    data = JSON.parse(File.read(Rails.root.join('spec', 'support', 'qualtrics_fake_response.json')))
    data['result'] = data['result'].deep_merge(result) if result
    allow_any_instance_of(QualtricsApi).to receive(:get_survey_definition).and_return(data['result'])
  end

  def mock_qualtrics_clone_survey!(new_id: 'new_id', key: 'invalid_test_key')
    allow_any_instance_of(CloneSurvey).to receive(:clone).and_return([new_id, key])
  end
end
