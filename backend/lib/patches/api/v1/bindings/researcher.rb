# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::Researcher.class_exec do
    def self.create_from_model(model)
      attributes = model.attributes_for_binding(self)
      attributes[:avatar_url] = Rails.application.routes.url_helpers.rails_blob_path(model.avatar)
      new(attributes)
    end
  end

end
