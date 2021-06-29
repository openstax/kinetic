class CreateLaunchedStages < ActiveRecord::Migration[6.1]
  def change
    create_table :launched_stages do |t|
      t.references :stage, null: false, foreign_key: true
      t.uuid :user_id
      t.datetime :first_launched_at
      t.datetime :completed_at

      t.timestamps
    end
    add_index :launched_stages, :user_id
  end
end
