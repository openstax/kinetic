class StudyCompletionCount < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :completed_count, :integer, default: 0, null: false

    reversible do |dir|
      dir.up do
        Study.all.each{ |s| Study.update_counters(s.id, completed_count: s.launched_studies.complete.count ) }
      end
    end
  end
end
