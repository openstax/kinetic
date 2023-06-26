# frozen_string_literal: true

# the dev admin user query for testing:
# JSON.parse(OpenStax::Accounts::Api.search_accounts("uuid:aaa560a1-e828-48fb-b9a8-d01e9aec71d0").response.body)

class UserInfo

  def self.email_for_account(account)
    email = account['contact_infos'].find do |ci|
      ci['is_verified'] && ci['is_guessed_preferred']
    end || account['contact_infos'].find { |ci| ci['is_verified'] }
    email.present? ? email['value'] : nil
  end

  def self.for_uuids(uuids)
    user_uuids = {}
    uuids.in_groups_of(10) do |uuid_group|

      search = uuid_group.map { |uuid| "uuid:#{uuid}" }
      body = query_accounts(search.join(' '))

      JSON.parse(body)['items'].each do |account|
        account['email_address'] = email_for_account(account)
        user_uuids[account['uuid']] = OpenStruct.new(account)
      end
    end

    user_uuids
  end

  def self.query_accounts(query)
    return JSON.generate({ 'items' => [] }) unless Rails.env.production?

    OpenStax::Accounts::Api.search_accounts(query).response.body
  end
end
