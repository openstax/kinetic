# frozen_string_literal: true

Rails.application.config.to_prepare do

  Api::V1::Bindings::StudyUpdate.class_exec do
    def update_model!(model)
      model.update!(
        # create a hash of attributes with nil values as a default for the update
        # this way omitted fields from the update will be set to nil
        Study::NULLABLE_FIELDS.zip([nil]).to_h.merge(to_hash)
      )
    end
  end

end
