class CreateStudies < ActiveRecord::Migration[6.1]
  def change
    create_table :studies do |t|
      t.string :name_for_researchers
      t.string :name_for_participants, null: false
      t.text :description_for_researchers
      t.text :description_for_participants, null: false
      t.integer :duration_minutes
      t.datetime :opens_at
      t.datetime :closes_at

      t.timestamps
    end
  end
end
