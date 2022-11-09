class SessionPointsAndTimes < ActiveRecord::Migration[6.1]
  def change
    add_column :stages, :duration_minutes, :integer, null: false, default: 0
    add_column :stages, :points, :integer, null: false, default: 0

    reversible do |dir|
      dir.up do
        Study.find_each do | study |
          study.stages.update_all!(
            duration_minutes: study.duration_minutes.div(study.stages.size),
            points: study.points.div(study.stages.size)
          )
        end
      end

      dir.down do
        Study.find_each do | study |
          study.update!(
            duration_minutes: study.stages.sum(:duration_minutes),
            participation_points: study.stages.sum(:points)
          )
        end
      end
    end

    remove_column :studies, :duration_minutes, :integer
    remove_column :studies, :participation_points, :integer
  end
end
