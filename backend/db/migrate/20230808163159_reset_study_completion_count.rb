class ResetStudyCompletionCount < ActiveRecord::Migration[6.1]
  def up
    Study.all.each do |s|
      s.update_columns(completed_count: s.launched_studies.complete.count)
    end
  end
end
