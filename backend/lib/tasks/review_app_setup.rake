namespace :heroku do
  desc 'review app postdeploy script'
  task :review_app_setup do
    require 'platform-api'

    openstax_domain = 'sandbox.openstax.org'.freeze

    # Environment variables are provided when specified in app.json
    heroku_app_name = ENV['HEROKU_APP_NAME']
    # dnsimple_account_id = ENV['DNSIMPLE_ACCOUNT_ID']

    # Extract out "pr-<pull request ID>" from default name
    pr_number = ENV['HEROKU_PR_NUMBER']
    # subdomain = "labs-#{pr_number}"
    subdomain = "review"
    type = { type: 'CNAME' }

    heroku_client = PlatformAPI.connect_oauth ENV['HEROKU_API_TOKEN']

    # Configure Custom Domain in Heroku
    hostname = [subdomain, openstax_domain].join('.')
    heroku_client.domain.create(heroku_app_name, hostname: hostname)
    heroku_domain = heroku_client.domain.info(heroku_app_name, hostname)["cname"]

#    # Create CNAME record in Route53
#    opts = type.merge({ name: subdomain, content: heroku_domain })
#    # Query DNSimple to see if we already have a record.
#    resp = dnsimple_client.zones.zone_records dnsimple_account_id, clutter_domain, { filter: { name_like: subdomain } }
#
#    # If no record found, create a new one
#    if resp.total_entries == 0
#      dnsimple_client.zones.create_zone_record dnsimple_account_id, clutter_domain, opts
#    # On changes or redeploy of the review app, update the record to the new heroku domain
#    elsif resp.total_entries == 1
#      record_id = resp.data[0].id
#      client.zones.update_zone_record dnsimple_account_id, clutter_domain, record_id, opts
#    end
  end
end

