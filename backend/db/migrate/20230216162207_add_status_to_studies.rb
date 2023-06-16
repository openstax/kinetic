class AddStatusToStudies < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :view_count, :integer, default: 0
    add_column :studies, :study_type, :string
    # add_column :studies, :category, :string
    add_column :studies, :study_topic, :string
    # add_column :studies, :topic, :string
    add_column :studies, :study_subject, :string
    # add_column :studies, :subject, :string
    add_column :studies, :internal_description, :string
    add_column :studies, :shareable_after_months, :integer
    add_column :studies, :target_sample_size, :integer

    add_column :stages, :status, :integer, default: 0
    add_column :stages, :feedback_types, :string, array: true, null: false, default: []
    add_index :stages, :feedback_types, using: 'gin'

    add_column :study_researchers, :role, :integer, default: 0

    reversible do |dir|
      dir.up do
        Study.find_each do | study |
          title_for_researchers = study.title_for_researchers || study.title_for_participants
          study.update!(title_for_researchers: title_for_researchers, internal_description: ' ')
        end

        change_column_default :stages, :available_after_days, 1
        change_column :studies, :title_for_participants, :string, :default => '', :null => true
        change_column :studies, :short_description, :string, :default => '', :null => true
        change_column :studies, :long_description, :string, :default => '', :null => true
      end

      dir.down do
        change_column_default :stages, :available_after_days, 0
        change_column :studies, :title_for_participants, :string, :null => false
        change_column :studies, :short_description, :string, :null => false
        change_column :studies, :long_description, :string, :null => false
      end
    end

    remove_column :studies, :tags, :string
    remove_column :studies, :feedback_description, :string

    remove_column :stages, :title, :string
    remove_column :stages, :description, :string

    # Unused from last migration
    remove_column :researchers, :invite_code, :string

    # Remove unique indexes for study researchers
    remove_index :study_researchers, [:researcher_id, :study_id]
    add_index :study_researchers, [:researcher_id, :study_id]

  end
end
