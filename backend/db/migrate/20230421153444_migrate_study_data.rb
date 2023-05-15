class MigrateStudyData < ActiveRecord::Migration[6.1]
  def up
    # should load a hash (or array)
    studies = YAML.load_file(Rails.root.join('db/migrate/study_creation_migration_data.yaml'))

    studies.each do | s |
      # puts(s)
      # study = Study.find_by(s.id)

    end
  end
end
