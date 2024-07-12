class AddColorToLearningPath < ActiveRecord::Migration[7.1]
  def change
    add_column :learning_paths, :color, :string, null: false, default: '#000000'
  end
end
