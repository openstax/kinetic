class AddNurturingEmailSentToUserPreferences < ActiveRecord::Migration[7.1]
  def change
    add_column :user_preferences, :nurturing_email_sent, :boolean, default: false, null: false
  end
end
