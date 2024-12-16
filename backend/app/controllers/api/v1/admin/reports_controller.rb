# frozen_string_literal: true

class Api::V1::Admin::ReportsController < Api::V1::Admin::BaseController
  def learner_activity
    months_ago = params[:months_ago] || 1
    email = params[:email] || "Admin-Uno@test.openstax.org"
    report = LearnerActivityReport.new(months_ago:)
    date_range = "#{DateTime.now.strftime('%m/%d/%Y')} - today"
    UserMailer.with(email: email, csv: report.as_csv_string).send_report.deliver_now
  end
end
