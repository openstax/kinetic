class UserPrefDefaults < ActiveRecord::Migration[6.1]
  def change
    change_column_default :user_preferences, :cycle_deadlines_email, false
    change_column_default :user_preferences, :prize_cycle_email, false
    change_column_default :user_preferences, :study_available_email, false
  end
end
