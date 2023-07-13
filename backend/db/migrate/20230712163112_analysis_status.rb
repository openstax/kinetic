class AnalysisStatus < ActiveRecord::Migration[6.1]
  def change
    remove_column :analysis_runs, :did_succeed, :boolean
    add_column :analysis_runs, :status, :integer, default: 0
  end
end
