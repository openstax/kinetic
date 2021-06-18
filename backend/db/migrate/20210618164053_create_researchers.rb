class CreateResearchers < ActiveRecord::Migration[6.1]
  def change
    create_table :researchers do |t|
      t.uuid :user_id
      t.string :first_name
      t.string :last_name

      t.timestamps
    end
    add_index :researchers, :user_id
  end
end
