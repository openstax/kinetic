class AddOrderToLearningPaths < ActiveRecord::Migration[7.1]
  def up
    add_column :learning_paths, :order, :integer

    LearningPath.find_by(label: 'Personal Finance').update(order: 0)
    LearningPath.find_by(label: 'Growth & Resilience').update(order: 1)
    LearningPath.find_by(label: 'Mental Agility').update(order: 2)
    LearningPath.find_by(label: 'Learning Persistence').update(order: 3)
    LearningPath.find_by(label: 'Productivity').update(order: 4)
    LearningPath.find_by(label: 'Interpersonal Skills').update(order: 5)
    LearningPath.find_by(label: 'Study Strategies').update(order: 6)
    LearningPath.find_by(label: 'STEM Careers').update(order: 7)
    LearningPath.find_by(label: 'Biology Learning').update(order: 8)
    LearningPath.find_by(label: 'Future Careers').update(order: 9)
  end

  def down
    remove_column :learning_paths, :order, :integer
  end
end
