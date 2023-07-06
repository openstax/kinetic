# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResearcherNotifications, type: :mailer do
  let(:added_researcher) { create(:researcher) }
  let(:added_researcher_info) { OpenStruct.new(uuid: added_researcher.user_id, full_name: Faker::Name.name, email_address: Faker::Internet.email) }
  let(:added_researcher_info_response) { [[added_researcher.user_id, added_researcher_info]].to_h }

  let(:removed_researcher) { create(:researcher) }
  let(:removed_researcher_info) { OpenStruct.new(uuid: removed_researcher.user_id, full_name: Faker::Name.name, email_address: Faker::Internet.email) }
  let(:removed_researcher_info_response) { [[removed_researcher.user_id, removed_researcher_info]].to_h }
  let(:study) { create(:study, num_stages: 1) }

  before do
    allow(UserInfo).to receive(:for_uuids).and_return(
      { added_researcher_info.uuid => added_researcher_info }
    )
  end

  # TODO: Removed researcher tests
  it 'notifies researchers that were added and removed from study' do
    assert_emails 1 do
      described_class.notify_study_researchers([added_researcher], [], study, removed_researcher)
    end

    # Invited email
    email1 = ActionMailer::Base.deliveries.first
    expect(email1.to).to eq [added_researcher_info.email_address]
    expect(email1.subject).to match 'OpenStax Kinetic: You’ve been invited to collaborate on a study'

    # Will use this when we start notifying removed users as well
    # Removed email
    # email2 = ActionMailer::Base.deliveries.last
    # expect(email2.to).to eq [removed_researcher_info.email_address]
    # expect(email2.subject).to match "You've been removed from a study"
  end
end
