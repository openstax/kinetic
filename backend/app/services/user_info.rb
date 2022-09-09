# frozen_string_literal: true

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

      JSON.parse(
        OpenStax::Accounts::Api
          .search_accounts(search.join(' '))
          .response.body
      )['items'].each do |account|

        account['email_address'] = email_for_account(account)

        user_uuids[account['uuid']] = OpenStruct.new(account)
      end
    end
    user_uuids
  end
end
