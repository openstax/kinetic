# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V0::Bindings::Study.class_exec do
    class << self
      include Rails.application.routes.url_helpers
    end

    def self.create_from_model(model)
      attributes = model.attributes

      attributes[:return_url] = frontend_returning_url(model.id)

      attributes[:researchers] = model.researchers.map do |researcher_model|
        Api::V0::Bindings::Researcher.create_from_model(researcher_model)
      end

      attributes[:stages] = model.stages.map do |stage_model|
        Api::V0::Bindings::Stage.create_from_model(stage_model)
      end

      new(attributes)
    end
  end

end
