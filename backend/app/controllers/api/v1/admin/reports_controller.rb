class Api::V1::Admin::ReportsController < Api::V1::Admin::BaseController
  def learner_activity
    months_ago = params[:months_ago] || 1
    csv = LearnerActivityReport.new(months_ago: months_ago)

    send_data(
      csv.as_csv_string,
      filename: 'test.csv',
      type: :csv,
    )

  end
end
