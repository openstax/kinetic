class ExportsCutoffAt < ActiveRecord::Migration[6.1]
  def change
    add_column :analysis_response_exports, :cutoff_at, :datetime
  end
end
