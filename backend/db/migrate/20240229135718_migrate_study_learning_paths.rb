class MigrateStudyLearningPaths < ActiveRecord::Migration[6.1]
  def up
    # Create the learning paths provided by research
    example_path = LearningPath.create!(
      label: 'Example Learning Path',
      description: 'A cool learning path for testing'
    )

    not_fun_path = LearningPath.create!(
      label: 'Not very fun path',
      description: 'a boring path for testing'
    )

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
      # if learning_goals.include?(study.id)
      #   study.update({ :topic => 'Learning Goals' })
      # elsif memory_and_cognition.include?(study.id)
      #   study.update({ :topic => 'Memory & Cognition' })
      # elsif personality.include?(study.id)
      #   study.update({ :topic => 'Personality' })
      # elsif self_reflection.include?(study.id)
      #   study.update({ :topic => 'Self Reflection' })
      # elsif study_strategies.include?(study.id)
      #   study.update({ :topic => 'Study Strategies' })
      # else # Default to other just in case... don't want any old lingering topics
      #   study.update({ :topic => 'Other' })
      # end
    end
  end

  def down
    # learning = [26, 35, 36, 12, 18, 39, 78, 2, 6, 10, 13, 14, 15, 28, 31, 77, 80, 123, 124, 126]
    # memory = [1, 11]
    # personality = [8, 16, 21, 29, 37, 81, 83, 3, 5, 7, 17, 22, 24, 79, 82, 9, 32, 33, 34]
    # school_and_career = [4, 25, 19, 20, 117]
    # other = [116, 38, 40, 43, 44, 118, 129]
    #
    # Study.all.each do |study|
    #   if learning.include?(study.id)
    #     study.update({ :topic => 'Learning' })
    #   elsif memory.include?(study.id)
    #     study.update({ :topic => 'Memory' })
    #   elsif personality.include?(study.id)
    #     study.update({ :topic => 'Personality' })
    #   elsif school_and_career.include?(study.id)
    #     study.update({ :topic => 'School & Career' })
    #   else # Default to other just in case... don't want any old lingering topics
    #     study.update({ :topic => 'Other' })
    #   end
    # end
  end
end
