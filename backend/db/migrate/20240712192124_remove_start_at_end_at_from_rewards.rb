class RemoveStartAtEndAtFromRewards < ActiveRecord::Migration[7.1]
  def change
    remove_column :rewards, :start_at, :timestamp
    remove_column :rewards, :end_at, :timestamp
  end
end
