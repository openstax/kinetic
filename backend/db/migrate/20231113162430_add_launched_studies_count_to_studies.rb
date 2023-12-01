class AddLaunchedStudiesCountToStudies < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :launched_studies_count, :integer
  end
end
