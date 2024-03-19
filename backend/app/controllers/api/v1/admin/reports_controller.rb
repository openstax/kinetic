# frozen_string_literal: true

class Api::V1::Admin::ReportsController < Api::V1::Admin::BaseController
  def learner_activity
    months_ago = params[:months_ago] || 1
    report = LearnerActivityReport.new(months_ago:)
    date_range = "#{DateTime.now.strftime('%m/%d/%Y')} - today"

    send_data(
      report.as_csv_string,
      filename: "learner-activity-report-#{date_range}.csv",
      type: :csv
    )
  end
end
