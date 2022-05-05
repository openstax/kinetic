class AddLaunchedStudyRefToLaunchedStage < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        add_reference :launched_stages, :launched_study
        execute <<-SQL
        update launched_stages 
          set launched_study_id = launched_studies.id
        from stages, launched_studies
        where
          stages.study_id = launched_studies.study_id
          and stages.id = launched_stages.stage_id
          and launched_studies.user_id = launched_stages.user_id
        SQL

        change_column_null :launched_stages, :launched_study_id, false
        add_foreign_key :launched_stages, :launched_studies
      end
      dir.down do
        remove_reference :launched_stages, :launched_study
      end
    end
  end
end
