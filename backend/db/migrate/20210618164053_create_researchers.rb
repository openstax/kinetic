class CreateResearchers < ActiveRecord::Migration[6.1]
  def change
    create_table :researchers do |t|
      t.uuid :user_id, null: false, index: {unique: true}
      t.string :name
      t.string :institution
      t.text :bio

      t.timestamps
    end
  end
end
