# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Analysis.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      new(attributes)
    end
  end
end
