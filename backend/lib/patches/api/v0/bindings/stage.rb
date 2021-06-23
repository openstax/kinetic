# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V0::Bindings::Stage.class_exec do
    class << self
      include Rails.application.routes.url_helpers
    end

    def self.create_from_model(model)
      attributes = model.attributes.with_indifferent_access
      attributes[:return_url] = returning_url(attributes.delete(:return_id))
      new(attributes)
    end
  end

end
