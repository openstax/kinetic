# frozen_string_literal: true

secrets = Rails.application.credentials.dig(:accounts, :oauth, :secret)

unless secrets
  warn 'No oauth client_id/secret provided; not configuring OpenStax::Accounts!'
  return
end

OpenStax::Accounts.configure do |config|
  config.openstax_accounts_url = secrets[:url]
  config.openstax_application_id = secrets[:client_id]
  config.openstax_application_secret = secrets[:secret]
end
