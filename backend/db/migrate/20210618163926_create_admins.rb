class CreateAdmins < ActiveRecord::Migration[6.1]
  def change
    create_table :admins do |t|
      t.uuid :user_id, null: false, index: {unique: true}

      t.timestamps
    end
  end
end
