class CreateParticipantStages < ActiveRecord::Migration[6.1]
  def change
    create_table :participant_stages do |t|
      t.references :stage, null: false, foreign_key: true
      t.uuid :user_id
      t.datetime :first_launched_at
      t.datetime :completed_at
    end
    add_index :participant_stages, :user_id
  end
end
