# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Analysis.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      new(attributes).tap do |bnd|
        bnd.studies = model.study_analyses.as_json(only: [:study_id])
        bnd.study_ids = bnd.studies.map(&:values).flatten
        bnd.runs = model.runs.map do |analysis_run|
          Api::V1::Bindings::AnalysisRun.create_from_model(analysis_run)
        end
      end
    end
  end
end
