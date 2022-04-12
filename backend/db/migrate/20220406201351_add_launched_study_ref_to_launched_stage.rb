class AddLaunchedStudyRefToLaunchedStage < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        add_reference :launched_stages, :launched_study
        execute 'update launched_stages lsa '\
                'set launched_study_id = '\
                '(select lsu.id from stages s join launched_studies lsu '\
                'on s.study_id = lsu.study_id '\
                'where s.id = lsa.stage_id and lsu.user_id = lsa.user_id)'
        change_column_null :launched_stages, :launched_study_id, false
        add_foreign_key :launched_stages, :launched_studies
      end
      dir.down do
        remove_reference :launched_stages, :launched_study
      end
    end
  end
end
