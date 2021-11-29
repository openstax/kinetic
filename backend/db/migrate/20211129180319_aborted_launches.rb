class AbortedLaunches < ActiveRecord::Migration[6.1]
  def change
    add_column :launched_studies, :aborted_at, :datetime
    add_column :launched_studies, :consent_granted, :boolean
  end
end
