class CreateRewards < ActiveRecord::Migration[6.1]
  def change
    create_table :rewards do |t|
      t.text :description, null: false
      t.text :info_url, null: true
      t.integer :points, null: false
      t.datetime :start_at, :end_at, null: false
      t.timestamps
    end
  end
end
