class CreateParticipantMetadata < ActiveRecord::Migration[6.1]
  def change
    create_table :participant_metadata do |t|
      t.uuid :user_id, null: false, index: true
      t.references :study, null: false, foreign_key: true
      t.jsonb :metadata
      t.column :created_at, :datetime # no updated_at, records are intended to be immutable
    end
  end
end
