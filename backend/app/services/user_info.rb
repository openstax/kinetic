# frozen_string_literal: true

# the dev admin user query for testing:
# JSON.parse(OpenStax::Accounts::Api.search_accounts("uuid:aaa560a1-e828-48fb-b9a8-d01e9aec71d0").response.body)

class UserInfo

  MOCK_USERS = YAML.load_file(Rails.root.join('config/data/mock-users.yaml'))

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

    u = for_uuids([uuid]).values[0]&.table || {}
    u.merge(
      {
        user_id: uuid,
        is_administrator: Admin.where(user_id: uuid).any?,
        is_researcher: Researcher.where(user_id: uuid).any?
      }
    )
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
        is_researcher: true,
        is_administrator: false
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
        is_administrator: true,
        is_researcher: false
      }
    end
  end

  def self.dev_user_info(uuid)
    u = UserInfo::MOCK_USERS[uuid] ||
        dev_researchers.find { |r| r[:user_id] == uuid } ||
        dev_admins.find { |a| a[:user_id] == uuid }

    return {} if u.nil?

    u.merge({
              user_id: u[:user_id],
              name: u[:name],
              full_name: u[:name],
              first_name: u[:first_name],
              last_name: u[:last_name],
              contact_infos: [{
                type: 'EmailAddress', value: "#{u[:first_name]}-#{u[:last_name]}@test.openstax.org"
              }]
            })
  end

end
