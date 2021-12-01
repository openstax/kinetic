# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Stage.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes.with_indifferent_access
      new(attributes)
    end
  end

end
