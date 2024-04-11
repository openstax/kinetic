# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::LearningPath.class_exec do
    def self.create_from_model(model, user=nil)
      attributes = model.attributes_for_binding(self)
      new(attributes).tap do |bnd|
        bnd.studies = model.studies
        bnd.completed = model.completed?(user) unless user.nil?
        bnd.badge = OpenBadgeApi.instance.badge_info(model.badge_id) unless model.badge_id.nil?
      end
    end
  end

end
