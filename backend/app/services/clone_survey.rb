# frozen_string_literal: true

class CloneSurvey

  attr_reader :api

  def initialize(survey_id)
    @survey_id = survey_id
    @api = QualtricsApi.new
    @source = api.get_survey_definition(survey_id, format: 'qsf')
  end

  def clone(new_name)
    result = @api.create_survey(@source.merge({
      SurveyEntry: @source['SurveyEntry'].merge({ SurveyName: new_name })
    }.deep_stringify_keys))

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
  end
end
