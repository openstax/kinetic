# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V0::Bindings::ParticipantStudy.class_exec do
    def self.create_from_model(model)
      attributes =
        case model
        when LaunchedStudy
          attributes_from_launched_study(model)
        when Study
          attributes_from_study_model(model)
        end

      attributes[:researchers] = model.researchers.map do |researcher_model|
        Api::V0::Bindings::PublicResearcher.create_from_model(researcher_model)
      end

      new(attributes)
    end

    def self.attributes_from_launched_study(model)
      attributes_from_study_model(model.study).tap do |attributes|
        attributes.merge!(
          model.attributes.slice(
            :first_launched_at,
            :completed_at,
            :opted_out_at
          )
        )
      end
    end

    def self.attributes_from_study_model(model)
      model.attributes.tap do |attributes|
        attributes.title = model.title_for_participants
      end
    end
  end

end
