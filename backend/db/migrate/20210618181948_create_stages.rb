class CreateStages < ActiveRecord::Migration[6.1]
  def change
    create_table :stages do |t|
      t.references :study, null: false, foreign_key: true
      t.integer :order, null: false
      t.jsonb :config, null: false

      t.timestamps
    end
    add_index :stages, [:order, :study_id], unique: true
  end
end
