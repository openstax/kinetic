class UpdateUserPreferences < ActiveRecord::Migration[7.1]
  def change
    remove_column :user_preferences, :prize_cycle_email, :boolean
    remove_column :user_preferences, :cycle_deadlines_email, :boolean

    add_column :user_preferences, :digital_badge_available_email, :boolean, default: false, null: false
  end
end
