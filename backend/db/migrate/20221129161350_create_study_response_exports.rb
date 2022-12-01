class CreateStudyResponseExports < ActiveRecord::Migration[6.1]
  def change
    create_table :study_response_exports do |t|
      t.references :study, null: false, foreign_key: true
      t.boolean :is_complete, :is_empty, :is_testing, default: false

      t.jsonb :metadata, default: {}
      t.timestamps
    end
  end
end
