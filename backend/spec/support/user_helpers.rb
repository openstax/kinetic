# frozen_string_literal: true

module UserHelpers
  def stub_current_user(uuid_or_object)
    uuid =
      case uuid_or_object
      when String
        uuid_or_object
      when Researcher, Admin
        uuid_or_object.user_id
      else
        raise 'Unsupported argument'
      end

    allow_any_instance_of(ApplicationController).to receive(:current_user_uuid).and_return(uuid)
  end

  def stub_random_user
    stub_current_user(SecureRandom.uuid)
  end
end
