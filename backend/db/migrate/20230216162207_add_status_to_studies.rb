class AddStatusToStudies < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :status, :integer, default: 0
    add_column :studies, :target_sample_size, :integer, default: 0
    add_column :studies, :view_count, :integer, default: 0

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
