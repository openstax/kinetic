class CreateLaunchedStudies < ActiveRecord::Migration[6.1]
  def change
    create_table :launched_studies do |t|
      t.references :study, null: false, foreign_key: true
      t.uuid :user_id, null: false
      t.datetime :first_launched_at
      t.datetime :completed_at
      t.datetime :opted_out_at

      t.timestamps
    end
    add_index :launched_studies, [:user_id, :study_id], unique: true
  end
end
