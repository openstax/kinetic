class CreateUserPreferences < ActiveRecord::Migration[6.1]
  def change
    create_table :user_preferences do |t|
      t.uuid :user_id, null: false, index: true
      t.boolean :cycle_deadlines_email,
                :prize_cycle_email,
                :study_available_email,
                :session_available_email,
                default: true, null: false
      t.timestamps
    end
  end
end
