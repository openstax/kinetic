# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::AnalysisRun.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      attributes[:messages] = model.messages
      new(attributes).tap do |bnd|
        bnd.messages = model.messages.as_json
      end
    end
  end
end
