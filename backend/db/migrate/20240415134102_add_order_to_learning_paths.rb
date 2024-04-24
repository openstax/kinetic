class AddOrderToLearningPaths < ActiveRecord::Migration[7.1]
  def up
    add_column :learning_paths, :order, :integer

    LearningPath.where(label: 'Personal Finance').update(order: 0)
    LearningPath.where(label: 'Growth & Resilience').update(order: 1)
    LearningPath.where(label: 'Mental Agility').update(order: 2)
    LearningPath.where(label: 'Learning Persistence').update(order: 3)
    LearningPath.where(label: 'Productivity').update(order: 4)
    LearningPath.where(label: 'Interpersonal Skills').update(order: 5)
    LearningPath.where(label: 'Study Strategies').update(order: 6)
    LearningPath.where(label: 'STEM Careers').update(order: 7)
    LearningPath.where(label: 'Biology Learning').update(order: 8)
    LearningPath.where(label: 'Future Careers').update(order: 9)
  end

  def down
    remove_column :learning_paths, :order, :integer
  end
end
