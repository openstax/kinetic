# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::ParticipantStudy.class_exec do
    def self.create_from_model(model, user=nil)
      attributes =
        case model
        when LaunchedStudy
          attributes_from_launched_study(model, user)
        when Study
          attributes_from_study_model(model, user)
        end

      new(attributes)
    end

    def self.attributes_from_launched_study(model, user=nil)
      attributes_from_study_model(model.study, user).tap do |attributes|
        attributes.merge!(
          model.attributes.with_indifferent_access.slice(
            :first_launched_at,
            :completed_at,
            :opted_out_at,
            :consent_granted
          )
        )
      end
    end

    def self.attributes_from_study_model(model, user=nil)
      model.attributes_for_binding(self).tap do |attributes|
        attributes[:title] = model.title_for_participants
        if user
          attributes[:stages] = model.stages.map do |stage_model|
            Api::V1::Bindings::ParticipantStudyStage.create_from_model(stage_model, user)
          end
        end
        attributes[:researchers] = model.researchers.map do |researcher_model|
          Api::V1::Bindings::PublicResearcher.create_from_model(researcher_model)
        end
      end
    end
  end

end
