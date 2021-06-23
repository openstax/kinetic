class CreateResearchers < ActiveRecord::Migration[6.1]
  def change
    create_table :researchers do |t|
      t.uuid :user_id, null: false
      t.string :name
      t.string :institution
      t.text :bio

      t.timestamps
    end
    add_index :researchers, :user_id
  end
end
