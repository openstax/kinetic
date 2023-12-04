# frozen_string_literal: true

class CloneSurvey

  attr_reader :api

  def initialize(survey_id=Rails.application.secrets.qualtrics_template_survey_id)
    @survey_id = survey_id
    @api = QualtricsApi.new
  end

  def clone(new_name)
    unless Rails.env.production?
      return [@survey_id,
              Rails.application.secrets.qualtrics_template_survey_secret_key]
    end

    @source = api.get_survey_definition(@survey_id, format: 'qsf')

    result = @api.create_survey(@source.merge(
                                  { SurveyEntry: @source['SurveyEntry'].merge(
                                    { SurveyName: new_name }
                                  ) }.deep_stringify_keys
    ))
    @api.share_survey(
      result['SurveyID'],
      Rails.application.secrets.qualtrics_group_library,
      {
        # TODO: viewSurvey is ignored, have contacted support about it
        viewSurveyResults: true, viewSurveys: true,
        activateSurveys: true, copySurveyQuestions: true, copySurveys: true,
        createResponseSets: true, deactivateSurveys: true, editSurveyFlow: true, editSurveys: true,
        distributeSurveys: true, editQuestions: true, editResultSets: true,
        exportSurveyData: true, setSurveyOptions: true, translateSurveys: true,
        useAdvancedQuotas: true, useBlocks: true, useCrossTabs: true, deleteSurveyQuestions: true,
        useReferenceBlocks: true, useScreenouts: true, useAEConjoint: true, useAETriggers: true,
        useSubgroupAnalysis: true, useTableOfContents: true, viewPersonalData: true,
        manageScreenouts: true, customizeTheme: true,
        useFlowControlLogic: true, editTextiQBasic: true, viewTextiQBasic: true,
        manageParticipants: false, sendInvites: false, useStatsIqCrosstabs: true,
        viewResponseID: true, useQuotas: true, editThreeSixtyForms: false
      })
    # TODO: simpler one day?
    secret_key = @source['SurveyElements'].find do |el|
                   el['Element'] == 'FL'
                 end['Payload']['Flow'].first['SSOOptions']['token']['Key']
    [result['SurveyID'], secret_key]
  end
end
