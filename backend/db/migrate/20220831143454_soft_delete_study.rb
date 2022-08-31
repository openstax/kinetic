class SoftDeleteStudy < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :is_deleted, :boolean, default: false, null: false
  end
end
