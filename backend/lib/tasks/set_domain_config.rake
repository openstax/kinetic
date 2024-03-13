# frozen_string_literal: true

namespace :heroku do
  desc 'Heroku production postdeploy: set AWS domain from HOST'
  task :set_domain_config do
    require 'platform-api'
    require 'aws-sdk-route53'

    # Environment variables are provided when specified in app.json
    heroku_app_name = ENV.fetch('HEROKU_APP_NAME', nil)
    hostname = ENV.fetch('HOST', nil)
    openstax_domain = 'kinetic.openstax.org'

    # Configure Custom Domain in Heroku
    heroku_client = PlatformAPI.connect_oauth ENV.fetch('HEROKU_API_TOKEN', nil)

    heroku_domain = heroku_client.domain.list(heroku_app_name).select do |d|
                      d['hostname'] == hostname
                    end [0]

    if heroku_domain.nil?
      heroku_client.domain.create(heroku_app_name, hostname:)
      heroku_cname = heroku_client.domain.info(heroku_app_name, hostname)['cname']
    else
      heroku_cname = heroku_domain['cname']
    end

    # Create or update (UPSERT) CNAME record in Route53 - credentials are in ENV
    aws_creds = Aws::AssumeRoleCredentials.new(
      {
        role_arn: 'arn:aws:iam::373045849756:role/research-kinetic-dns',
        role_session_name: 'HerokuProdDeploy'
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
                    value: heroku_cname
                  }
                ]
              }
            }
          ]
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
