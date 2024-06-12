class CreateRewards < ActiveRecord::Migration[6.1]
  def change
    create_table :rewards do |t|
      t.text :prize, null: false
      t.text :info_url, null: true
      t.integer :points, null: false
      t.timestamps
    end
  end
end
