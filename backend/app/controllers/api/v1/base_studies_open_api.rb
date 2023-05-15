# frozen_string_literal: true

class Api::V1::BaseStudiesOpenApi
  include OpenStax::OpenApi::Blocks

  openapi_component do
    schema :BaseStudy do
      property :title_for_participants do
        key :type, :string
        key :description, 'The study name that participants see.'
      end
      property :title_for_researchers do
        key :type, :string
        key :description, 'The study name that only researchers see.'
        key :minLength, 1
      end
      property :short_description do
        key :type, :string
        key :description, 'A short study description.'
      end
      property :long_description do
        key :type, :string
        key :description, 'A long study description.'
      end
      property :internal_description do
        key :type, :string
        key :description, 'An internal study description for researchers.'
        key :minLength, 1
      end
      property :image_id do
        key :type, :string
        key :description, 'Freeform id of image that should be displayed on study card'
      end
      property :benefits do
        key :type, :string
        key :description, 'Description of how the study benefits participants'
      end
      property :is_hidden do
        key :type, :boolean
        key :description, 'Is the study hidden from participants'
      end
      property :first_launched_at do
        key :type, :string
        key :format, 'date-time'
        key :description, 'When the study was launched; null means not launched'
      end
      property :status do
        key :type, :string
        key :description, 'Status of the stage'
        key :enum, %w[active paused scheduled draft waiting_period ready_for_launch completed]
        key :readOnly, true
      end
      property :researchers do
        key :type, :array
        key :description, 'The study\'s researchers.'
        items do
          key :$ref, :Researcher
        end
      end
      property :is_mandatory do
        key :type, :boolean
        key :description, 'Mandatory studies must be completed by all users'
      end
      property :view_count do
        key :type, :number
        key :description, 'How many times the study has been viewed'
      end
      property :shareable_after_months do
        key :type, :number
        key :description, 'How many months until the study is public'
        key :nullable, true
      end
      property :completed_count do
        key :type, :number
        key :description, 'Number of times this study has been completed'
        key :readOnly, true
      end
      property :study_type do
        key :type, :string
        key :description, 'The type of study'
      end
      property :study_topic do
        key :type, :string
        key :description, 'The study topic'
      end
      property :study_subject do
        key :type, :string
        key :description, 'The study\'s subject'
      end
      property :stages do
        key :type, :array
        key :description, 'The study\'s stages.'
        items do
          key :$ref, :Stage
        end
      end
      property :launched_count do
        key :type, :number
        key :description, 'How many times the study has been launched'
        key :readOnly, true
      end
      property :return_url do
        key :type, :string
        key :description, 'The URL to which stages should return after completing'
        key :readOnly, true
      end
    end
  end
end
