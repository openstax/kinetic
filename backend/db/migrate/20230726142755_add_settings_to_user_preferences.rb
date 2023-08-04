class AddSettingsToUserPreferences < ActiveRecord::Migration[6.1]
  def change
    add_column :user_preferences, :has_viewed_analysis_tutorial, :boolean, default: false
  end
end
