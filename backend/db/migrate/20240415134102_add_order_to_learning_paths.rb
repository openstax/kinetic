class AddOrderToLearningPaths < ActiveRecord::Migration[7.1]
  def up
    add_column :learning_paths, :order, :integer
  end

  def down
    remove_column :learning_paths, :order, :integer
  end
end
