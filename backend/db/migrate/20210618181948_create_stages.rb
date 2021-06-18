class CreateStages < ActiveRecord::Migration[6.1]
  def change
    create_table :stages do |t|
      t.references :study, null: false, foreign_key: true
      t.integer :order, null: false
      t.jsonb :config
      t.string :labs_return_url

      t.timestamps
    end
  end
end
