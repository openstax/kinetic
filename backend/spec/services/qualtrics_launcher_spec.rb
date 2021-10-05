# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QualtricsLauncher do

  let(:config) do
    {
      type: 'qualtrics',
      url: 'https://foo.com',
      secret_key: 'faY0ccV2dtF19TMS'
    }.with_indifferent_access
  end

  let(:known_valid_ssotoken) do
    # Generated using "Generate test token" button on Qualtrics survey
    'ql5aeihGrs3oG5tR0BDuaxSGKRVPmfd5zUK08QLn9Ld5gddl7GVTN%2FtZS3j5%2BTZusMRi0EgMi67ocXYrVJs45lbbHEr2w3tr%2BjDv1qZYztIcfWOxH1Ik3ndIudGOkG%2FcQuF88D%2BlIa%2Br1Q%2BC%2FDFi0tH83whoPh%2B52aRbBYolcNk%3D'
  end

  let(:user_id) { SecureRandom.uuid }
  let(:research_id) { '1234' }
  let(:study_id) { '4321' }

  it 'shows we can decrypt a Qualtrics-generated token' do
    expect(
      decrypt_params(url: "https://blah.com?ssotoken=#{known_valid_ssotoken}", key: config[:secret_key])
    ).to eq(
      'research_id' => research_id,
      'study_id' => study_id
    )
  end

  it 'generates and decypts a token' do
    research_id = ResearchId.for_user_id(user_id).id
    launcher = described_class.new(config: config, user_id: user_id, study_id: study_id)
    expect(decrypt_params(url: launcher.url, key: config[:secret_key])).to eq(
      'research_id' => research_id,
      'study_id' => study_id
    )
  end

  it 'previews' do
    expect(described_class.new(config: config, user_id: user_id, study_id: study_id).preview_url).to match(/Q_CHL=preview/)
  end

  def decrypt_params(url:, key:)
    url = URI(url)
    hash = URI.decode_www_form(url.query).to_h
    query_params = URI.decode_www_form(decrypt(token_value: hash['ssotoken'], key: key)).to_h
    query_params.slice('research_id', 'study_id')
  end

  def decrypt(token_value:, key:)
    aes = OpenSSL::Cipher.new('AES-128-ECB')
    aes.decrypt
    aes.key = key
    aes.update(Base64.strict_decode64(token_value)) + aes.final
  end

end
# 1wkgUd7A/kZFfroc
