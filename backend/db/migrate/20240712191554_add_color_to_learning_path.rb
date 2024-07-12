class AddColorToLearningPath < ActiveRecord::Migration[7.1]
  def up
    add_column :learning_paths, :color, :string, null: false, default: '#000000'
  end

  def down
    remove_column :learning_paths, :color, :string
  end
end
