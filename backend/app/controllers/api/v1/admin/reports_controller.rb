# frozen_string_literal: true

class Api::V1::Admin::ReportsController < Api::V1::Admin::BaseController
  def learner_activity
    months_ago = params[:months_ago] || 1
    email = params[:email] || 'Admin-Uno@test.openstax.org'
    report = LearnerActivityReport.new(months_ago:)
    UserMailer.with(email:, csv: report.as_csv_string).send_report.deliver_now

    render json: { message: "Learner activity report has been sent to #{email}." }, status: :ok
  end
end
