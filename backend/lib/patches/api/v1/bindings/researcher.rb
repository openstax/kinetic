# frozen_string_literal: true

Rails.application.config.to_prepare do
  Api::V1::Bindings::Researcher.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      attributes[:avatar_url] = model.avatar_url
      new(attributes)
    end
  end
end
