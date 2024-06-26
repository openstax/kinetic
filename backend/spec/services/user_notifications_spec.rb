# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserNotifications, type: :mailer do

  let(:study1) { create(:study, num_stages: 1) }
  let(:past_study) { create(:study, opens_at: Date.yesterday, closes_at: 10.days.ago, num_stages: 1) }
  let(:multi_stage) { create(:study, num_stages: 2) }

  let(:user1_id) { SecureRandom.uuid }
  let(:user1_info) { OpenStruct.new(uuid: user1_id, full_name: Faker::Name.name, email_address: Faker::Internet.email) }
  let(:user1_info_response) { [[user1_id, user1_info]].to_h }

  let(:user2_id) { SecureRandom.uuid }

  let(:user1_study1_launch_pad) { LaunchPad.new(study_id: study1.id, user_id: user1_id) }
  let(:user1_multistage_launch_pad) { LaunchPad.new(study_id: multi_stage.id, user_id: user1_id) }

  before do
    allow(UserInfo).to receive(:for_uuids).and_return(user1_info_response)
    allow(described_class).to receive(:user_ids_with_emails_for).and_return([user1_id])
  end

  it 'delivers welcome email' do
    Timecop.freeze(1.day.ago) do
      user1_study1_launch_pad.launch
      user1_study1_launch_pad.land
    end
    assert_emails 1 do
      described_class.deliver_welcomes
    end

    email = ActionMailer::Base.deliveries.last
    expect(email.to).to eq [user1_info.email_address]
    expect(email.subject).to match 'Welcome to OpenStax Kinetic!'
  end

  it 'delivers additional session' do
    multi_stage.stages.last.update!(available_after_days: 2)
    user1_multistage_launch_pad.launch
    user1_multistage_launch_pad.land
    assert_emails 0 do
      described_class.deliver_additional_session
    end
    Timecop.freeze(3.days.from_now) do
      assert_emails 1 do
        described_class.deliver_additional_session
      end
    end
  end

  it 'delivers new studies' do
    past_study # force at least one study to exist
    assert_emails 1 do
      described_class.deliver_new_studies
    end
    email = ActionMailer::Base.deliveries.last
    expect(email.subject).to match 'new Kinetic study'
  end

end
