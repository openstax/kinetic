class AddIsWelcomeToStudies < ActiveRecord::Migration[7.1]
  def up
    add_column :studies, :is_welcome, :boolean, default: false

    welcome_studies = [3, 82]
    return if welcome_studies.any? { |id| !Study.exists?(id) }
    Study.where(id: welcome_studies).update_all(is_welcome: true)
  end

  def down
    remove_column :studies, :is_welcome, :boolean
  end
end
