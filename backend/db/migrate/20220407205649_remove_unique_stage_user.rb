class RemoveUniqueStageUser < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        remove_index :launched_stages, [:user_id, :stage_id]
        add_index :launched_stages, [:user_id, :stage_id, :launched_study_id],
          name: 'index_launched_stages_on_user_and_stage_and_launched_study',
          unique: true
      end
    
      dir.down do
        remove_index :launched_stages, name: 'index_launched_stages_on_user_and_stage_and_launched_study'
        add_index :launched_stages, [:user_id, :stage_id], unique: true
      end
    end
  end
end
