# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Study.class_exec do
    class << self
      include Rails.application.routes.url_helpers
    end

    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      attributes[:first_launched_at] = model.first_launched_study&.first_launched_at || nil
      attributes[:consented] = model.first_launched_study&.consent_granted || false
      attributes[:return_url] = frontend_returning_url(model.id)
      attributes[:learning_path] = model.learning_path

      attributes[:researchers] = model.study_researchers.map do |study_researcher|
        researcher = study_researcher.researcher
        researcher[:role] = study_researcher.role
        Api::V1::Bindings::Researcher.create_from_model(researcher)
      end

      attributes[:stages] = model.stages.map do |stage_model|
        Api::V1::Bindings::Stage.create_from_model(stage_model)
      end

      attributes[:status] = model.status
      attributes[:launched_count] = model.launched_count

      new(attributes)
    end
  end

end
