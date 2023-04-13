class AddStatusToStudies < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :view_count, :integer, default: 0
    add_column :studies, :study_type, :string
    add_column :studies, :study_topic, :string
    add_column :studies, :study_subject, :string
    add_column :studies, :internal_description, :string

    add_column :stages, :status, :integer, default: 0
    add_column :stages, :target_sample_size, :integer, default: 0
    add_column :stages, :feedback_types, :string, array: true, null: false, default: []
    add_index :stages, :feedback_types, using: 'gin'
    add_column :stages, :opens_at, :datetime
    add_column :stages, :closes_at, :datetime

    add_column :study_researchers, :role, :integer, default: 0

    reversible do |dir|
      dir.up do
        Study.find_each do | study |
          # TODO
          #  closed_at < DateTime.now => Completed
          #  opens_at > DateTime.now => Scheduled
          #  default => active
          #  if no PI or other  conditions from iris, set to draft
          # status = if !study.opens_at.nil? && study.opens_at > DateTime.now
          #            :draft
          #          elsif !study.closes_at.nil? && study.closes_at < DateTime.now
          #            :completed
          #          else
          #            :active
          #          end
          # Fill in blanks as researcher title is now required - some existing studies were missing it
          title_for_researchers = study.title_for_researchers || study.title_for_participants
          # study.update!(status: status, title_for_researchers: title_for_researchers)
          study.update!(title_for_researchers: title_for_researchers)
        end

        change_column :studies, :title_for_participants, :string, :default => '', :null => true
        change_column :studies, :short_description, :string, :default => '', :null => true
        change_column :studies, :long_description, :string, :default => '', :null => true
      end

      dir.down do
        change_column :studies, :title_for_participants, :string, :null => false
        change_column :studies, :short_description, :string, :null => false
        change_column :studies, :long_description, :string, :null => false
      end
    end

    # TODO Remove opens_at, closes_at on studies
    remove_column :studies, :closes_at, :datetime
    remove_column :studies, :opens_at, :datetime
    remove_column :studies, :tags, :string
    # TODO Update all instances of feedback_description to use study.stages
    remove_column :studies, :feedback_description, :string

    # Unused from last migration
    # remove_column :researchers, :invite_code, :string
  end
end
