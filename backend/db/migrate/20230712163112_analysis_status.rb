class AnalysisStatus < ActiveRecord::Migration[6.1]
  def change
    add_column :analysis_runs, :status, :integer, default: 0
  end
end
