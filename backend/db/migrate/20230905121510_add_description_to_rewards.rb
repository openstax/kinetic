class AddDescriptionToRewards < ActiveRecord::Migration[6.1]
  def change
    add_column :rewards, :description, :string, null: true
    remove_column :rewards, :info_url, :text
  end
end
