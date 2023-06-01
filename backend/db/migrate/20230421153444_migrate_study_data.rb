class MigrateStudyData < ActiveRecord::Migration[6.1]
  def up
    studies = YAML.load_file(Rails.root.join('db/migrate/study_creation_migration_data.yaml'))
    # Make the deploy happy
    # studies = []
    studies.each do | data |
      study = Study.includes(:stages, :study_researchers).find(data['id'])

      if study.nil?
        raise("Cant find study with id: #{data['id']}")
      end

      lead = Researcher.find_by(first_name: data['study_lead_first'], last_name: data['study_lead_last'])
      # if lead.nil?
      #   raise("Researcher #{data['study_lead']} not found")
      # end
      pi = Researcher.find_by(first_name: data['study_pi_first'], last_name: data['study_pi_last'])
      # if pi.nil?
      #   raise("Researcher #{data['study_pi']} not found")
      # end
      # Find out default member? kinetic admin?
      # member = Researcher.find_by(last_name: data['study_pi'])
      unless lead.nil?
        lead_sr = StudyResearcher.find_or_create_by({ study_id: study.id, researcher_id: lead.id, role: 'lead'})
        study.study_researchers << lead_sr unless lead_sr.nil?
      end

      unless pi.nil?
        pi_sr = StudyResearcher.find_or_create_by({ study_id: study.id, researcher_id: pi.id, role: 'pi'})
        study.study_researchers << pi_sr unless pi_sr.nil?
      end

      study.update({
        :title_for_researchers => data['title_for_researchers'],
        :internal_description => data['description_for_researchers'],
        :study_type => data['study_type'],
        :title_for_participants => data['title_for_participants'],
        :short_description => data['short_description_for_participants'],
        :long_description => data['long_description_for_participants'],
        :study_topic => data['study_topic'],
        :study_subject => data['study_subject'],
        :benefits => data['benefits'],
        :opens_at => data['opens_at']&.to_date,
        :closes_at => data['closes_at']&.to_date
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
