class MigrateStudyData < ActiveRecord::Migration[6.1]
  def up
    # should load a hash (or array)
    studies = YAML.load_file(Rails.root.join('db/migrate/study_creation_migration_data.yaml'))

    # magic here
    studies.each do | s |
      puts(study)
      study = Study.find(s.id)
    end
  end
end
