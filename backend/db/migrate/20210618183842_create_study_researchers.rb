class CreateStudyResearchers < ActiveRecord::Migration[6.1]
  def change
    create_table :study_researchers do |t|
      t.references :study, null: false, foreign_key: true
      t.references :researcher, null: false, foreign_key: true

      t.timestamps
    end
  end
end
