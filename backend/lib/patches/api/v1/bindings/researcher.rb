# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Researcher.class_exec do
    def self.create_from_model(model)
      new(model.attributes)
    end
  end

end
