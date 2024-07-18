class UpdateExistingLearningPathsWithColor < ActiveRecord::Migration[7.1]
  def up
      LearningPath.reset_column_information

      learning_paths_colors = {
        'Personal Finance' => '#B6DB93',
        'Growth & Resilience' => '#E69ECE',
        'Mental Agility' => '#FFC25B',
        'Learning Persistence' => '#72D4A8',
        'Productivity' => '#A8E5F8',
        'Interpersonal Skills' => '#70A4FF',
        'Study Strategies' => '#FFE65C',
        'STEM Careers' => '#6DD6DA',
        'Biology Learning' => '#F1A65E',
        'Future Careers' => '#FA8A8A'
      }

      learning_paths_colors.each do |label, color|
        learning_path = LearningPath.find_by(label: label)
        learning_path.update!(color: color)
      end
  end

  def down
    LearningPath.update_all(color: '#000000')
  end
end
