class RemoveIsMandatoryFromStudies < ActiveRecord::Migration[6.1]
  def change
    remove_column :studies, :is_mandatory, :boolean
  end
end
