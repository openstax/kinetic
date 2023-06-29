# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Analysis.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      new(attributes).tap do |bnd|
        bnd.studies = model.study_analyses.as_json(only: [:study_id])
        bnd.study_ids = bnd.studies.map { |s| s.values }.flatten
      end
    end
  end
end
