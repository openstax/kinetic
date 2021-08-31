class CreateStudies < ActiveRecord::Migration[6.1]
  def change
    create_table :studies do |t|
      t.string :title_for_researchers
      t.string :title_for_participants, null: false
      t.text :short_description, null: false
      t.text :long_description, null: false
      t.string :category, null: false
      t.integer :duration_minutes, null: false
      t.integer :participation_points
      t.datetime :opens_at
      t.datetime :closes_at
      t.boolean :is_mandatory, default: false, null: false
      t.timestamps
    end
  end
end
