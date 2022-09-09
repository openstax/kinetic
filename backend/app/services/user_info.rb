class UserInfo

  def self.for_uuids(uuids)
    user_uuids = {}
    uuids.in_groups_of(10) do |uuids|

      search = uuids.map { |uuid| "uuid:#{uuid}" }

      JSON.parse(
        OpenStax::Accounts::Api
          .search_accounts(search.join(' '))
          .response.body
      )['items'].each do |account|
        email = account['contact_infos'].find { |ci|
          ci['is_verified'] && ci['is_guessed_preferred']
        } ||
                account['contact_infos'].find { |ci| ci['is_verified'] }

        account['email_address'] = email['value'] if email.present?

        user_uuids[account['uuid']] = OpenStruct.new(account)
      end
    end
    user_uuids
  end
end
