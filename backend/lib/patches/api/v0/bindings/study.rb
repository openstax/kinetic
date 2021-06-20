# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V0::Bindings::Study.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes

      attributes[:researchers] = model.researchers.map do |researcher_model|
        Api::V0::Bindings::Researcher.create_from_model(researcher_model)
      end

      new(attributes)
    end
  end

end
