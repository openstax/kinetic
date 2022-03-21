# frozen_string_literal: true

Rails.application.config.to_prepare do
  Api::V1::Bindings::ParticipantStudyStage.class_exec do
    def self.create_from_model(model, user)
      new(
        model.attributes_for_binding(self).merge(
          is_launchable: model.launchable_by_user?(user),
          is_completed: model.has_been_completed_by_user?(user)
        )
      )
    end
  end
end
