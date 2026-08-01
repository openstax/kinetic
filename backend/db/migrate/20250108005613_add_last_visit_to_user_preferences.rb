class AddLastVisitToUserPreferences < ActiveRecord::Migration[7.1]
  def change
    add_column :user_preferences, :last_visited_at, :datetime, default: -> { 'CURRENT_TIMESTAMP' }, null: false
  end
end