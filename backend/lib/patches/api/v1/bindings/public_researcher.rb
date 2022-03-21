# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::PublicResearcher.class_exec do
    def self.create_from_model(model)
      model.to_api_binding(self)
    end
  end

end
