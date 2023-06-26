# frozen_string_literal: true

class EnclaveMailer < ApplicationMailer

  default from: 'OpenStax Kinetic <noreply@mg.kinetic.openstax.org>'

  def completed(run)
    mail(
      to: 'kinetic@openstax.org', # TODO: use this once email is present on researchers: run.analysis.researchers.first.email,
      subject: "Your analysis has #{run.did_succeed ? 'completed' : 'failed'}",
      template: 'enclave_run'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'analysis_title' => run.analysis.title,
        'results_title' => run.did_succeed ? 'View errors' : 'Download results',
        'results_link' => 'not yet implemented'
      }
    end
  end

end