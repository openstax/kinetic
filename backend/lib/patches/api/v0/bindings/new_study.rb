# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::NewStudy.class_exec do
    def create_model!(researcher:)
      Study.new(to_hash).tap do |study|
        study.researchers << researcher
        study.save!
      end
    end
  end

end
