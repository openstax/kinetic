# frozen_string_literal: true

secrets = Rails.application.secrets.accounts & [:sso]

unless secrets
  warn 'No auth secrets provided; not configuring OpenStax::Auth!'
  return
end

OpenStax::Auth.configure do |config|
  config.strategy2.signature_public_key = secrets[:signature_public_key]
  config.strategy2.encryption_private_key = secrets[:encryption_private_key]
  config.strategy2.cookie_name = secrets[:cookie_name] || 'oxa'
  config.strategy2.encryption_algorithm = secrets[:encryption_algorithm] || 'dir'
  config.strategy2.encryption_method = secrets[:encryption_method] || 'A256GCM'
  config.strategy2.signature_algorithm = secrets[:signature_algorithm] || 'RS256'
end
