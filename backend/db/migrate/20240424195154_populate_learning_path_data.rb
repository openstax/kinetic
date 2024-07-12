class PopulateLearningPathData < ActiveRecord::Migration[7.1]
  def up
    personal_finance = LearningPath.create!(
      label: 'Personal Finance',
      description: 'Check your financial knowledge',
      level_1_metadata: ['21st-Century Themes', 'Life and Career Skills'],
      level_2_metadata: ['Financial Literacy', 'Initiative and self-direction'],
      badge_id: 'SB001Ea7DGKaCKB',
      color: '#B6DB93',
      order: 0
    )

    growth_and_resilience = LearningPath.create!(
      label: 'Growth & Resilience',
      description: 'Persist through challenges',
      level_1_metadata: ['Life and Career Skills'],
      level_2_metadata: ['Flexibility and adaptability', 'Initiative and self-direction'],
      badge_id: 'SB0222a7DGDaNSS',
      color: '#E69ECE',
      order: 1
    )

    mental_agility = LearningPath.create!(
      label: 'Mental Agility',
      description: 'Explore how your memory works',
      level_1_metadata: ['Learning & Innovation Skills'],
      level_2_metadata: ['Critical Thinking and Problem Solving', 'Communication'],
      badge_id: 'SB03EYa7DGDaNUL',
      color: '#FFC25B',
      order: 2
    )

    learning_persistence = LearningPath.create!(
      label: 'Learning Persistence',
      description: 'Enhance your learning drive ',
      level_1_metadata: ['Life and Career Skills'],
      level_2_metadata: ['Productivity and accountability', 'Initiative and self-direction'],
      badge_id: 'SB02M4a7DGKaCN9',
      color: '#72D4A8',
      order: 3
    )

    productivity = LearningPath.create!(
      label: 'Productivity',
      description: 'Improve your productivity',
      level_1_metadata: ['Life and Career Skills'],
      level_2_metadata: ['Productivity and Accountability'],
      badge_id: 'SB03T0a7DGDaNV1',
      color: '#A8E5F8',
      order: 4
    )

    interpersonal_skills = LearningPath.create!(
      label: 'Interpersonal Skills',
      description: 'Strengthen social connections ',
      level_1_metadata: ['Life and Career Skills'],
      level_2_metadata: ['Social skills'],
      badge_id: 'SB04RKa7DGKaCOW',
      color: '#70A4FF',
      order: 5
    )

    study_strategies = LearningPath.create!(
      label: 'Study Strategies',
      description: 'Improve the way you learn',
      level_1_metadata: ['Learning & Innovation Skills', 'Essential Subjects'],
      level_2_metadata: ['Science', 'History', 'Critical Thinking & Problem Solving'],
      badge_id: 'SB0E56a7DGKaCVC',
      color: '#FFE65C',
      order: 6
    )

    stem_careers = LearningPath.create!(
      label: 'STEM Careers',
      description: 'Assess STEM interest',
      level_1_metadata: ['Learning & Innovation Skills', 'Essential Subjects'],
      level_2_metadata: ['Science', 'Mathematics', 'Critical Thinking and Problem Solving'],
      badge_id: 'SB05K7a7DGKaCPE',
      color: '#6DD6DA',
      order: 7
    )

    biology_learning = LearningPath.create!(
      label: 'Biology Learning',
      description: 'Improve how you study biology',
      level_1_metadata: ['Learning & Innovation Skills', 'Essential Subjects'],
      level_2_metadata: ['Critical Thinking and Problem Solving'],
      badge_id: 'SB07A9a7DGKaCQV',
      color: '#F1A65E',
      order: 8
    )

    future_careers = LearningPath.create!(
      label: 'Future Careers',
      description: 'Discover your career goals',
      level_1_metadata: ['Learning & Innovation Skills', 'Essential Subjects'],
      level_2_metadata: ['Social skills', 'Flexibility and adaptability', 'Science'],
      badge_id: 'SB06FPa7DGDaO08',
      color: '#FA8A8A',
      order: 9
    )

    if Rails.env.production?
      # Set highlighted studies
      highlighted_study_ids = [5, 116, 129]
      Study.where(id: highlighted_study_ids).update_all(is_highlighted: true)
      Study.where.not(id: highlighted_study_ids).update_all(is_highlighted: false)

      # Assign the studies to each path and set their order
      set_and_order_studies(personal_finance, [80, 117], [80, 117])
      set_and_order_studies(growth_and_resilience, [24, 32, 9, 22, 33], [24, 32, 9])
      set_and_order_studies(mental_agility, [12, 1, 18, 11, 39], [12, 1, 18])
      set_and_order_studies(learning_persistence, [21, 26, 16, 8, 36], [21, 26, 16])
      set_and_order_studies(productivity, [37, 82, 81, 79, 29], [37, 82, 81])
      set_and_order_studies(interpersonal_skills, [34, 7, 17, 78], [34, 7, 17])
      set_and_order_studies(study_strategies, [31, 14], [31, 14])
      set_and_order_studies(stem_careers, [19, 6, 126], [19, 6, 26])
      set_and_order_studies(biology_learning, [28, 10], [28, 10])
      set_and_order_studies(future_careers, [3, 4, 25], [3, 4, 25])

    else
      # random for dev
      all_learning_paths = LearningPath.all
      Study.find_each do |study|
        random_path = all_learning_paths.sample
        study.update!(learning_path_id: random_path.id)
      end
    end
  end

  def set_and_order_studies(path, all_study_ids, featured_study_ids)
    # Notify and skip if any study IDs don't exist
    if all_study_ids.any? { |id| !Study.exists?(id) }
      puts "Invalid list of study IDs #{all_study_ids}"
      return
    end
    path.study_ids = all_study_ids
    featured_study_ids.each_with_index do |study_id, index|
      Study.find(study_id).update(is_featured: true, featured_order: index)
    end
  end
end
