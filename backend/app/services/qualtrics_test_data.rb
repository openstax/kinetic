# frozen_string_literal: true

require 'faker'
require 'tempfile'
require 'csv'

class QualtricsTestData

  RECORDED_QUESTION_TYPES = %w[MC TE].freeze

  def initialize(stage:, random_seed:)
    Faker::Config.random = Random.new(random_seed)
    @stage = stage
  end


  def to_csv(response_count: 50)
    questions = QualtricsApi.new.get_survey_definition_questions(@stage)

    file = Tempfile.new(
      ["#{@stage.study.title_for_researchers.parameterize}-stage-#{@stage.order + 1}", '.csv']
    )

    csv = CSV.new(file)
    headings = []
    questions.each do |q|
      headings.push(q.DataExportTag) if question_is_recorded?(q)
    end

    csv << headings
    response_count.times do
      row = []
      questions.each do |q|
        next unless question_is_recorded?(q)

        response = response_for_question(q)
        row.push(response || '')
      end
      csv << row
    end
    file.flush
    file
  end

  def question_is_recorded?(question)
    RECORDED_QUESTION_TYPES.include?(question.QuestionType) &&
      question.dig(:DataVisibility, 'Hidden') == false
  end

  def response_for_question(question)
    return nil unless question_is_recorded?(question)

    case question.QuestionType
    when 'MC' then Faker::Base.sample(question['Choices'].values)['Display']
    when 'TE' then text_response(question)
    end
  end

  def text_response(question)
    validation = question.dig('Validation', 'Settings') || {}
    if validation['ValidNumber']
      if validation.dig('ValidNumber', 'Min').present? &&
         validation.dig('ValidNumber', 'Min') == validation.dig('ValidNumber', 'Max')
        return Faker::Number.number(digits: validation.dig('ValidNumber', 'Min').to_i)
      end

      return Faker::Address.zip if validation['ContentType'] == 'ValidZip'

      return Faker::Number.number
    end
    # final fallback
    Faker::Lorem.sentence
  end

end
