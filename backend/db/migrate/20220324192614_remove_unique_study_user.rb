class RemoveUniqueStudyUser < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        remove_index :launched_studies, [:user_id, :study_id]
        add_index :launched_studies, [:user_id, :study_id, :consent_granted],
          name: 'index_launched_studies_on_user_id_and_study_id_and_consent',
          unique: true
      end
    
      dir.down do
        remove_index :launched_studies, [:user_id, :study_id]
        add_index :launched_studies, [:user_id, :study_id], unique: true
      end
    end
  end
end
