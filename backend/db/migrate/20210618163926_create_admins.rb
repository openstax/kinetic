class CreateAdmins < ActiveRecord::Migration[6.1]
  def change
    create_table :admins do |t|
      t.uuid :user_id

      t.timestamps
    end
    add_index :admins, :user_id
  end
end
