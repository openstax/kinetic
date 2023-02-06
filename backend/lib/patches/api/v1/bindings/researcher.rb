# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Researcher.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      if model.avatar
        attributes[:avatar_url] = Rails.application.routes.url_helpers.url_for(model.avatar)
      end
      new(attributes)
    end
  end

end
