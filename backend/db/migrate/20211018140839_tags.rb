class Tags < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :tags, :string, array: true, null: false, default: []
    add_index :studies, :tags, using: 'gin'

    remove_column :studies, :category, :string
  end
end
