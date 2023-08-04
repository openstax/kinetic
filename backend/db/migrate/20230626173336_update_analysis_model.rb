class UpdateAnalysisModel < ActiveRecord::Migration[6.1]
  def up
    change_column :analyses, :repository_url, :text, :null => true
  end

  def down
    Analysis.where(repository_url: nil).update_all(repository_url: '')
    change_column :analyses, :repository_url, :text, :default => '', :null => false
  end
end
