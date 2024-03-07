class CreateStudyLearningPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :learning_paths do |t|
      t.string :label, null: false
      t.string :description, null: false
      t.timestamps
    end

    add_reference :studies, :learning_path, foreign_key: true

    add_column :studies, :is_featured, :boolean, default: false
    add_column :studies, :featured_order, :integer, null: true
    add_column :studies, :is_highlighted, :boolean, default: false
    remove_column :studies, :topic, :string
  end
end
