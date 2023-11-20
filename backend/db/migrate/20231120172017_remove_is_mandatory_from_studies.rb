class RemoveIsMandatoryFromStudies < ActiveRecord::Migration[6.1]
  def change
    remove_column :studies, :is_mandatory, :boolean
    add_column :user_preferences, :has_viewed_welcome_message, :boolean, default: false
  end
end
