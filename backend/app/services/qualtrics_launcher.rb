require "openssl"

class QualtricsLauncher

  def initialize(config:, user_id:)
    @config = config
    @user_id = user_id
  end

  def url
    uri = URI(config[:url])
    uri.query = URI.encode_www_form([['ssotoken', sso_token]])
    uri.to_s
  end

  protected

  attr_reader :config, :user_id

  def secret_key
    config[:secret_key]
  end

  def sso_token
    raw_query = URI.encode_www_form([
      ['timestamp', Time.now.utc.iso8601],
      ['expiration', 1.hour.from_now.utc.iso8601],
      ['research_id', user_id]
    ])

    hash = md5_hash(raw_query)
    unecrypted_token = "#{raw_query}&mac=#{hash}"
    encrypt(unecrypted_token)
  end

  def encrypt(value)
    aes = OpenSSL::Cipher.new('AES-128-ECB')
    aes.encrypt
    aes.key = secret_key
    encrypted = aes.update(value) + aes.final
    Base64.strict_encode64(encrypted)
  end

  def md5_hash(value)
    hash = OpenSSL::HMAC.digest(OpenSSL::Digest.new('md5'), secret_key, value)
    Base64.strict_encode64(hash)
  end

end
