# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::ParticipantStudy.class_exec do

    def self.create_from_models_list(models, user)
      completed_count = models.sum(&:completed_count)
      models.map do |model|
        create_from_model(model, user).tap do |attrs|
          attrs.popularity_rating = model.completed_count.to_f / completed_count
        end
      end
    end

    def self.create_from_model(model, user)
      attributes =
        case model
        when LaunchedStudy
          attributes_from_launched_study(model, user)
        when Study
          attributes_from_study_model(model, user)
        end

      new(attributes)
    end

    def self.attributes_from_launched_study(model, user)
      attributes_from_study_model(model.study, user).tap do |attributes|
        attributes.merge!(
          model.attributes.with_indifferent_access.slice(
            :first_launched_at,
            :completed_at,
            :opted_out_at
          )
        )
      end
    end

    def self.attributes_from_study_model(model, user)
      model.attributes_for_binding(self).tap do |attributes|
        attributes[:is_featured] = model.is_featured?
        attributes[:is_syllabus_contest_study] = model.is_syllabus_contest_study?
        attributes[:total_points] = model.total_points
        attributes[:total_duration] = model.total_duration
        attributes[:stages] = model.stages.map do |stage_model|
          Api::V1::Bindings::ParticipantStudyStage.create_from_model(stage_model, user)
        end

        attributes[:researchers] = model.study_researchers.map do |study_researcher|
          researcher = study_researcher.researcher
          researcher[:role] = study_researcher.role
          Api::V1::Bindings::Researcher.create_from_model(researcher)
        end
      end
    end
  end

end
