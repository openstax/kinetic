class CreateBanners < ActiveRecord::Migration[6.1]
  def change
    create_table :banners do |t|
      t.text :message, null: false
      t.datetime :start_at, :end_at, null: false
      t.timestamps
    end
  end
end
