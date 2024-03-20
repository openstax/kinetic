class MigrateStudyLearningPaths < ActiveRecord::Migration[6.1]
  def up
    # Create the learning paths provided by research
    example_path = LearningPath.create!(
      label: 'Example Learning Path',
      description: 'A cool learning path for testing'
    )
    # Associate easily:
    # example_path.study_ids = [6]

    not_fun_path = LearningPath.create!(
      label: 'Not very fun path',
      description: 'a boring path for testing'
    )

    if Rails.env.production?
      # do random samples
    else
      # do the real thing
    end

    # Topics with the corresponding study IDs
    # personality = [3, 5, 7, 17, 22, 24, 79, 82]
    # memory_and_cognition = [1, 11, 12, 18, 39]
    # learning_goals = [4, 8, 16, 21, 26, 29, 35, 36, 37, 81, 116]
    # self_reflection = [9, 25, 32, 33, 34, 78]
    # study_strategies = [2, 6, 10, 13, 14, 15, 19, 20, 28, 31, 77, 80, 117, 123, 124, 126]
    # other = [38, 40, 43, 44, 83, 118, 129]

    Study.find_each do |study|
      # 50/50 for dev
      if [true, false].sample
        study.update!(learning_path_id: example_path.id)
      else
        study.update!(learning_path_id: not_fun_path.id)
      end
    end
  end

  def down

  end
end
