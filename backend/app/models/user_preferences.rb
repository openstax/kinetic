class UserPreferences < ApplicationRecord

  def self.for_user_id(user_id)
    find_or_create_by(user_id: user_id)
  end

end
