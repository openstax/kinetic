# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::LearningPath.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      new(attributes).tap do |bnd|
        bnd.studies = model.studies
      end
    end
  end

end
