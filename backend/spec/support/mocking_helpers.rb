# frozen_string_literal: true

module MockingHelpers
  def stub_qualtrics_survey_definition!(result=nil)
    data = JSON.parse(File.read(Rails.root.join('spec', 'support', 'qualtrics_fake_response.json')))
    data['result'] = data['result'].deep_merge(result) if result
    allow_any_instance_of(QualtricsApi).to receive(:get_survey_definition).and_return(data['result'])
  end

  def stub_qualtrics_clone_survey!(new_id: 'new_id', key: 'invalid_test_key')
    allow_any_instance_of(CloneSurvey).to receive(:clone).and_return([new_id, key])
  end

  def stub_user_query(user=nil)
    json = user ? JSON.generate({ items: [user] }) : File.read(Rails.root.join('spec', 'support', 'accounts_users_response.json'))
    allow(UserInfo).to receive(:query_accounts).and_return(json)
  end
end
