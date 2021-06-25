class CreateParticipantStudies < ActiveRecord::Migration[6.1]
  def change
    create_table :participant_studies do |t|
      t.references :study, null: false, foreign_key: true
      t.uuid :user_id, null: false
      t.datetime :opted_out_at

      t.timestamps
    end
    add_index :participant_studies, :user_id
  end
end
