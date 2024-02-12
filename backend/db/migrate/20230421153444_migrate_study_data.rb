class MigrateStudyData < ActiveRecord::Migration[6.1]
  def up
    studies = YAML.load_file(Rails.root.join('db/migrate/study_migration_data.yaml'))
    studies.each do |data|
      study = Study.includes(:stages, :study_researchers).find_by(id: data['id'])

      if study.nil?
        puts("Cant find study with id: #{data['id']}")
        next
      end

      lead = Researcher.find_by(user_id: data['study_lead_uuid'])
      pi = Researcher.find_by(user_id: data['study_pi_uuid'])

      unless lead.nil?
        lead_sr = StudyResearcher.find_or_create_by(study_id: study.id, researcher_id: lead.id, role: 'lead')
        study.study_researchers << lead_sr unless lead_sr.nil?
      end

      unless pi.nil?
        pi_sr = StudyResearcher.find_or_create_by(study_id: study.id, researcher_id: pi.id, role: 'pi')
        study.study_researchers << pi_sr unless pi_sr.nil?
      end

      study.update({
        :title_for_researchers => data['title_for_researchers'],
        :internal_description => data['description_for_researchers'],
        :category => data['study_type'],
        :title_for_participants => data['title_for_participants'],
        :short_description => data['short_description_for_participants'],
        :long_description => data['long_description_for_participants'],
        :topic => data['study_topic'],
        :subject => data['study_subject'],
        :benefits => data['benefits'],
        :opens_at => data['opens_at']&.to_date,
        :closes_at => data['closes_at']&.to_date,
        :public_on => data['public_on'] == 'now' ? DateTime.now : data['public_on']&.to_date
      })

      data['stages'].each_with_index do |stage_data, index|
        study.stages[index]&.update({
          :status => data['status'],
          :points => stage_data['points'],
          :duration_minutes => stage_data['duration_minutes'],
          :feedback_types => stage_data['feedback_types'],
          :available_after_days => stage_data['available_after_days'] || 1,
        })
      end

    end
  end
end
