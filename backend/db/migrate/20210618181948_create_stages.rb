class CreateStages < ActiveRecord::Migration[6.1]
  def change
    create_table :stages do |t|
      t.references :study, null: false, foreign_key: true
      t.integer :order, null: false, index: {unique: true}
      t.jsonb :config, null: false
      t.string :return_id, null: false, index: {unique: true}

      t.timestamps
    end
  end
end
