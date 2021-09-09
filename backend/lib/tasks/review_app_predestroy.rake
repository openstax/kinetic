namespace :heroku do
  desc 'Delete the custom domain record set up for the Review App'
  task :review_app_predestroy do
#    require 'dnsimple'
#
#    # Cleanup subdomain DNS record for Heroku review app
#    clutter_domain = 'clutter.com'.freeze
#    heroku_app_name    = ENV['HEROKU_APP_NAME']
#    dnsimple_account_id = ENV['DNSIMPLE_ACCOUNT_ID']
#
#    # Extract out "pr-<pull request ID>" from default name
#    pr_number = heroku_app_name.match(/.*(pr-\d+)/).captures.first
#    subdomain = "account-#{pr_number}"
#
#    dnsimple_client = Dnsimple::Client.new access_token: ENV['DNSIMPLE_ACCESS_TOKEN']
#
#    # Remove record from DNSimple
#    resp = dnsimple_client.zones.zone_records dnsimple_account_id, clutter_domain, { filter: { name_like: subdomain } }
#    if resp.total_entries == 1
#      record_id = resp.data[0].id
#      dnsimple_client.zones.delete_zone_record dnsimple_account_id, clutter_domain, record_id
#    end
  end
end

