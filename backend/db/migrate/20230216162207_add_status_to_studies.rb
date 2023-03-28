class AddStatusToStudies < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :status, :integer, default: 0
    add_column :studies, :target_sample_size, :integer, default: 0
    add_column :studies, :view_count, :integer, default: 0

    add_column :studies, :study_type, :string
    add_column :studies, :study_topic, :string
    add_column :studies, :study_subject, :string

    add_column :stages, :feedback_types, :string, array: true, null: false, default: []
    add_index :stages, :feedback_types, using: 'gin'

    # TODO Update all instances of feedback_description to use study.stages
    remove_column :studies, :feedback_description, :string

    add_column :study_researchers, :role, :integer, default: 0

    # create_table :study_invites do |t|
    #   t.references :study, null: false, foreign_key: true
    #   t.string :email, null: false
    #   t.string :role, null: false
    #   t.timestamps
    # end
    # add_index :study_invites, [:researcher_id, :study_id], unique: true

    reversible do |dir|
      dir.up do
        Study.find_each do | study |
          # TODO
          #  closed_at < DateTime.now => Completed
          #  opens_at > DateTime.now => Scheduled
          #  default => active
          #  if no PI or other  conditions from iris, set to draft
          status = if !study.opens_at.nil? && study.opens_at > DateTime.now
                     :draft
                   elsif !study.closes_at.nil? && study.closes_at < DateTime.now
                     :completed
                   else
                     :active
                   end
          study.update!(status: status)
        end
      end

      dir.down do

      end
    end
  end
end
