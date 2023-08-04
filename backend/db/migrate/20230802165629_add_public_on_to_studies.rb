class AddPublicOnToStudies < ActiveRecord::Migration[6.1]
  def up
    remove_column :studies, :shareable_after_months, :integer
    add_column :studies, :public_on, :datetime, null: true
  end

  def down
    remove_column :studies, :public_on, :datetime
    add_column :studies, :shareable_after_months, :integer
  end
end
