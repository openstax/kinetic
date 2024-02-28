class CreateStudyLearningPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :learning_paths do |t|
      t.string :label, null: false
      t.string :description, null: false
      t.timestamps
    end

    add_reference :studies, :learning_path, foreign_key: true

    add_column :studies, :is_featured, :boolean, default: false
  end
end
