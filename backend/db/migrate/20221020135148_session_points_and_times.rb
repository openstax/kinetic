class SessionPointsAndTimes < ActiveRecord::Migration[6.1]
  def change
    add_column :stages, :duration_minutes, :integer, null: false, default: 0, if_not_exists: true
    add_column :stages, :points, :integer, null: false, default: 0, if_not_exists: true

    Study.all.each do |study|
      num_stages = study.stages.count == 0 ? 1 : study.stages.count
      study.stages.all.each do |stage|
        chunked_duration = study.duration_minutes&.div(num_stages)
        chunked_points = study.participation_points&.div(num_stages)
        stage.update(duration_minutes: chunked_duration)
        stage.update(points: chunked_points)
      end
    end

    remove_column :studies, :duration_minutes, :integer, if_exists: true
    remove_column :studies, :participation_points, :integer, if_exists: true
  end
end
