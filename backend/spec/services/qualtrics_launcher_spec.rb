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
    'FL3ghD3UzMZs0aNasdKlvFkHi3uATPks3wGueHQZ4VXJfR7mKM%2FMV5byH3mJVnHD2Z2Yrn5H0sSNJzdC71TyVv%2FufFVwm%2BQmrBF89IwqnU5RegPUyU7zOzgU78bImEtgE0GFtrZ9R40JPlRiqiZamw%3D%3D'
  end

  let(:user_id) { SecureRandom.uuid }

  it 'shows we can decrypt a Qualtrics-generated token' do
    expect(decrypt_research_id(url: "https://blah.com?ssotoken=#{known_valid_ssotoken}", key: config[:secret_key])).to eq 'foo'
  end

  it 'works' do
    launcher = described_class.new(config: config, user_id: user_id)
    expect(decrypt_research_id(url: launcher.url, key: config[:secret_key])).to eq user_id
  end

  it 'previews' do
    expect(described_class.new(config: config, user_id: user_id).preview_url).to match(/Q_CHL=preview/)
  end

  def decrypt_research_id(url:, key:)
    url = URI(url)
    hash = URI.decode_www_form(url.query).to_h
    query_params = URI.decode_www_form(decrypt(token_value: hash['ssotoken'], key: key)).to_h
    query_params['research_id']
  end

  def decrypt(token_value:, key:)
    aes = OpenSSL::Cipher.new('AES-128-ECB')
    aes.decrypt
    aes.key = key
    aes.update(Base64.strict_decode64(token_value)) + aes.final
  end

end
