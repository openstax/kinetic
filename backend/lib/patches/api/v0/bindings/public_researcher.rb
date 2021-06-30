# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V0::Bindings::PublicResearcher.class_exec do
    def self.create_from_model(model)
      new(model.attributes)
    end
  end

end
