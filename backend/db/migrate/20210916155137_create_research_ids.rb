class CreateResearchIds < ActiveRecord::Migration[6.1]
  def change
    create_table :research_ids, id: false do |t|
      t.text :id, null: false, primary_key: true
      t.uuid :user_id, null: false, index: {unique: true}
      t.timestamps
    end
  end
end
