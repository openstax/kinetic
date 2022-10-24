class SessionPointsAndTimes < ActiveRecord::Migration[6.1]
  def change
    # add_column :stages, :duration_minutes, :integer, null: false, default: 0
    # add_column :stages, :points, :integer, null: false, default: 0

    Study.all.each do |study|
      num_stages = study.stages.count == 0 ? 1 : study.stages.count
      study.stages.all.each do |stage|
        # p stage
        chunked_duration = study.duration_minutes&.div(num_stages)
        chunked_points = study.participation_points&.div(num_stages)
        p chunked_duration
        p chunked_points
        # stage.update(duration_minutes: study.duration_minutes / num_stages)
        # stage.update(points: study.participation_points / num_stages)
      end
    end

    # remove_column :studies, :duration_minutes, :integer
    # remove_column :studies, :participation_points, :integer
  end
end
