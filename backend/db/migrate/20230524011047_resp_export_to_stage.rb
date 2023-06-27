class RespExportToStage < ActiveRecord::Migration[6.1]
  def change
    rename_table :analysis_response_exports, :response_exports
    ResponseExport.destroy_all
    remove_column :response_exports, :analysis_id, :bigint
    add_reference :response_exports, :stage, null: false, foreign_key: true
  end
end
