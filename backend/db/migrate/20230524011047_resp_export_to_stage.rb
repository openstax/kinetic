class RespExportToStage < ActiveRecord::Migration[6.1]
  def change
    AnalysisResponseExport.destroy_all
    rename_table :analysis_response_exports, :response_exports
    remove_column :response_exports, :analysis_id
    add_reference :response_exports, :stage, null: false, foreign_key: true
  end
end
