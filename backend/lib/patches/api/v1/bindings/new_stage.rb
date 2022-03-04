# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::NewStage.class_exec do
    def create_model!(study:)
      Stage.new(to_hash).tap do |stage|
        stage.study = study
        stage.save!
      end
    end
  end

end
