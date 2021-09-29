# frozen_string_literal: true

namespace :heroku do
  desc 'review app postdeploy script'
  task :review_app_setup do
    require 'platform-api'
    require 'aws-sdk-route53'

    # Q: do we ever want to do non-sandbox PR review?
    openstax_domain = 'kenetic.sandbox.openstax.org'

    # Environment variables are provided when specified in app.json
    heroku_app_name = ENV['HEROKU_APP_NAME']
    pr_number = ENV['HEROKU_PR_NUMBER']
    subdomain = "PR-#{pr_number}"
    hostname = [subdomain, openstax_domain].join('.')

    # Configure Custom Domain in Heroku
    heroku_client = PlatformAPI.connect_oauth ENV['HEROKU_API_TOKEN']
    heroku_client.domain.create(heroku_app_name, hostname: hostname)
    heroku_domain = heroku_client.domain.info(heroku_app_name, hostname)['cname']

    # Create or update (UPSERT) CNAME record in Route53 - credentials are in ENV
    aws_creds = Aws::AssumeRoleCredentials.new(
      {
        role_arn: 'arn:aws:iam::373045849756:role/research-kenetic-dns',
        role_session_name: 'HerokuKeneticReview'
      })
    r53 = Aws::Route53::Client.new({ credentials: aws_creds })
    # DNS zone name ends with a fullstop
    domain = r53.list_hosted_zones.hosted_zones.select do |zone|
               zone[:name] == "#{openstax_domain}."
             end [0]
    abort "Domain #{openstax_domain} does not exist" unless domain
    zone_id = domain.id

    change = r53.change_resource_record_sets(
      {
        hosted_zone_id: zone_id,
        change_batch: {
          changes: [
            {
              action: 'UPSERT',
              resource_record_set: {
                name: hostname,
                type: 'CNAME',
                ttl: 60,
                resource_records: [
                  {
                    value: heroku_domain
                  }
                ]
              }
            }
          ],
          comment: "Review domain for kenetic #{subdomain}"
        }
      })

    change_id = change.change_info.id

    # Wait for change to be active
    delay = 1
    while (change.change_info.status == 'PENDING') & (delay < 30)
      change = r53.get_change({ id: change_id })
      sleep delay
      delay *= 2
    end

    # Setup encryption by enabling Automated Certificate Management
    heroku_client.app.enable_acm(heroku_app_name)

  end
end
