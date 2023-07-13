# frozen_string_literal: true

class EnclaveMailer < ApplicationMailer

  default from: 'OpenStax Kinetic <noreply@mg.kinetic.openstax.org>'

  def completed(run, results_url)
    mail(
      to: 'kinetic@openstax.org', # TODO: use this once email is present on researchers: run.analysis.researchers.first.email,
      subject: "Your analysis has #{run.did_succeed? ? 'completed' : 'failed'}",
      template: "enclave_analysis_run_#{run.did_succeed? ? 'success' : 'failure'}"
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'researcher_first_name' => run.analysis.researchers.first.first_name,
        'researcher_last_name' => run.analysis.researchers.first.last_name,
        'started_at' => run.started_at.to_formatted_s(:long),
        'dashboard_link' => api_default_researcher_analysis_url(run.analysis),
        'analysis_title' => run.analysis.title,
        'status' => run.did_succeed? ? 'succeeded' : 'failed',
        'results_link' => results_url
      }
    end
  end

end
