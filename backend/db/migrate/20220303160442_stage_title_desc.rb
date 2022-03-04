class StageTitleDesc < ActiveRecord::Migration[6.1]
  def change
    add_column :stages, :title, :string
    add_column :stages, :description, :string
    add_column :stages, :available_after_days, :float, null: false, default: 0
  end
end
