# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QualtricsLauncher do
  let(:study1) { create(:study, num_stages: 2) }
  let(:stage1a) { study1.stages.order(:order)[0] }
  let(:stage1b) { study1.stages.order(:order)[1] }
  let(:survey_id) { '1Q_B23Y82' }
  let(:secret_key) { 'faY0ccV2dtF19TMS' }
  let(:user_id) { SecureRandom.uuid }
  let(:research_id) { '1234' }

  let(:known_valid_ssotoken) do
    # Generated using "Generate test token" button on Qualtrics survey with research_id = 1234 and study_id = 4331
    'ql5aeihGrs3oG5tR0BDuaxSGKRVPmfd5zUK08QLn9Ld5gddl7GVTN%2FtZS3j5%2BTZusMRi0EgMi67ocXYrVJs45lbbHEr2w3tr%2BjDv1qZYztIcfWOxH1Ik3ndIudGOkG%2FcQuF88D%2BlIa%2Br1Q%2BC%2FDFi0tH83whoPh%2B52aRbBYolcNk%3D'
  end

  let(:launch_pad) { LaunchPad.new(study_id: study1.id, user_id: user_id) }

  let(:launcher) do
    described_class.new(
      secret_key: secret_key, survey_id: survey_id, user_id: user_id, study_id: study1.id, stage_ordinal: stage1a.order
    )
  end

  before do
    # Start study with our user of interest
    launch_pad.launch_url
  end

  it 'shows we can decrypt a Qualtrics-generated token' do
    expect(
      decrypt_params(url: "https://blah.com?ssotoken=#{known_valid_ssotoken}", key: secret_key)
    ).to eq(
      'research_id' => research_id,
      'study_id' => '4321'
     )
  end

  it 'generates and decypts a token' do
    research_id = ResearchId.for_user_id(user_id).id
    expect(decrypt_params(url: launcher.url, key: secret_key)).to eq(
      'research_id' => research_id,
      'study_id' => study1.id.to_s,
      'is_testing' => true.to_s,
      'return_to_url' => "http://example.com/study/land/#{study1.id}",
      'opted_out' => '',
      'consented' => '',
      'stage_ordinal' => stage1a.order.to_s
    )
  end

  it 'previews' do
    expect(launcher.preview_url).to match(/Q_CHL=preview/)
  end

  def decrypt_params(url:, key:)
    url = URI(url)
    hash = URI.decode_www_form(url.query).to_h
    query_params = URI.decode_www_form(decrypt(token_value: hash['ssotoken'], key: key)).to_h
    query_params.slice('research_id', 'study_id', 'return_to_url', 'is_testing', 'opted_out', 'consented', 'stage_ordinal')
  end

  def decrypt(token_value:, key:)
    aes = OpenSSL::Cipher.new('AES-128-ECB')
    aes.decrypt
    aes.key = key
    aes.update(Base64.strict_decode64(token_value)) + aes.final
  end

end
