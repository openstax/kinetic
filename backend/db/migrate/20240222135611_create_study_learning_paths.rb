class CreateStudyLearningPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :learning_paths do |t|
      t.belongs_to :study, null: false, foreign_key: true
      t.string :label, null: false
      t.string :description, null: false
      t.timestamps
    end
  end
end
