class ExportsCutoffAt < ActiveRecord::Migration[6.1]
  def change
    remove_column :studies, :shareable_after_months, :integer
    add_column :studies, :public_on, :datetime, null: true
    add_column :analysis_response_exports, :cutoff_at, :datetime
  end
end
