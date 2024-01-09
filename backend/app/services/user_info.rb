# frozen_string_literal: true

# the dev admin user query for testing:
# JSON.parse(OpenStax::Accounts::Api.search_accounts("uuid:aaa560a1-e828-48fb-b9a8-d01e9aec71d0").response.body)

class UserInfo

  def self.mock_users
    [
      { user_id: '00000000-0000-0000-0000-000000000000', role: 'admin', first_name: 'Admin',
        last_name: 'Uno', name: 'Admin Uno', full_name: 'Admin Uno' },
      { user_id: '00000000-0000-0000-0000-000000000001', role: 'researcher', name: 'Researcher Uno',
        full_name: 'Researcher Uno', first_name: 'Researcher', last_name: 'Uno' },
      { user_id: '00000000-0000-0000-0000-000000000002', role: 'user', name: 'User Uno',
        full_name: 'User Uno', first_name: 'User', last_name: 'Uno' },
      { user_id: '00000000-0000-0000-0000-000000000003', role: 'user', name: 'User Dos',
        full_name: 'User Dos', first_name: 'User', last_name: 'Dos' },
      { user_id: '00000000-0000-0000-0000-000000000004', role: 'user', name: 'User Tres',
        full_name: 'User Tres', first_name: 'User', last_name: 'Tres' },
      { user_id: '00000000-0000-0000-0000-000000000005', role: 'user', name: 'User Cuatro',
        full_name: 'User Cuatro', first_name: 'User', last_name: 'Cuatro' }
    ].freeze
  end

  def self.email_for_account(account)
    email = account['contact_infos'].find do |ci|
      ci['is_verified'] && ci['is_guessed_preferred']
    end || account['contact_infos'].find { |ci| ci['is_verified'] }
    email.present? ? email['value'] : nil
  end

  def self.for_uuids(uuids)
    user_uuids = {}
    uuids.in_groups_of(10) do |uuid_group|
      search = uuid_group.filter(&:present?).map { |uuid| "uuid:#{uuid}" }
      body = query_accounts(search.join(' '))
      JSON.parse(body)['items'].each do |account|
        account['email_address'] = email_for_account(account)
        user_uuids[account['uuid']] = OpenStruct.new(account)
      end
    end

    user_uuids
  end

  def self.for_uuid(uuid)
    return dev_user_info(uuid) unless Rails.env.production?

    for_uuids([uuid]).values[0]&.table || {}
  end

  def self.query_accounts(query)
    OpenStax::Accounts::Api.search_accounts(query).response.body
  end

  def self.dev_researchers
    Researcher.all.map do |researcher|
      {
        user_id: researcher.user_id,
        first_name: researcher.first_name,
        last_name: researcher.last_name,
        name: "#{researcher.first_name} #{researcher.last_name}",
        isResearcher: true,
        isAdmin: false
      }
    end
  end

  def self.dev_admins
    Admin.all.map do |admin|
      {
        user_id: admin.user_id,
        first_name: 'Admin',
        last_name: 'McAdminFace',
        name: 'Admin McAdminFace',
        isAdmin: true,
        isResearcher: false
      }
    end
  end

  def self.find_user(uuid)
    u = nil
    mock_user = UserInfo.mock_users.find { |user| user[:user_id] == uuid }
    researcher = dev_researchers.find { |r| r[:user_id] == uuid }
    admin = dev_admins.find { |a| a[:user_id] == uuid }

    if mock_user
      u = mock_user
    elsif researcher
      u = researcher
    elsif admin
      u = admin
    end

    u
  end

  def self.dev_user_info(uuid)
    u = UserInfo.find_user(uuid)

    return {} if u.nil?

    {
      id: u[:user_id],
      name: u[:name],
      full_name: u[:name],
      first_name: u[:first_name],
      last_name: u[:last_name],
      contact_infos: [{
        type: 'EmailAddress', value: "#{u[:name].parameterize}@test.openstax.org"
      }]
    }
  end

end
