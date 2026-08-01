# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: 'OpenStax Kinetic <noreply@mg.kinetic.openstax.org>'

  def welcome
    mail(
      to: params[:user].email_address,
      subject: 'Welcome to OpenStax Kinetic!',
      template: 'welcome'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name
      }
    end
  end

  def additional_session
    mail(
      to: params[:user].email_address,
      subject: 'It’s finally here! The second part of your Kinetic study',
      template: 'two_part_study'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name,
        'study_name' => params[:study].title_for_participants,
        'study_details_url' => "https://kinetic.openstax.org/studies/details/#{params[:study].id}"
      }
    end
  end

  def new_prize_cycle
    mail(
      to: params[:user].email_address,
      subject: 'A new cycle of learning awaits!',
      template: 'new_prize_cycle'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name,
        'prize_name' => params[:reward].prize
      }
    end
  end

  def nurturing_email
    mail(
      to: params[:user].email_address,
      subject: 'We miss you. Exciting Study Paths Await You!',
      template: 'nurturing email'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'first_name' => params[:user].first_name,
        'studyPathTitle' => if params[:initiated_learning_path]
                              params[:initiated_learning_path].label
                            else
                              params[:not_initiated_learning_path].label
                            end
      }
    end
  end

  def upcoming_prize_cycle_deadline
    mail(
      to: params[:user].email_address,
      subject: "Don't miss out on an exciting prize!",
      template: 'upcoming_prize_cycle_deadline'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name,
        'prize_name' => params[:reward].prize
      }
    end
  end

  def new_studies
    mail(
      to: params[:user].email_address,
      subject: 'A brand new Kinetic study - just for you!',
      template: 'new_studies'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name,
        'newStudyTitle' => params[:study].title_for_participants
      }
    end
  end

  def new_learning_path
    mail(
      to: params[:user].email_address,
      subject: 'A new study path awaits you!',
      template: 'new_study_path'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'first_name' => params[:user].first_name,
        'new_studyPathTitle' => params[:learning_path].title
      }
    end
  end

  def invite_researcher_to_study
    mail(
      to: params[:target_user].email_address,
      subject: 'OpenStax Kinetic: You’ve been invited to collaborate on a study',
      template: 'researcher_collaboration_invite'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'researcher_first_name' => params[:current_user].first_name,
        'researcher_last_name' => params[:current_user].last_name,
        'internal_study_title' => params[:study].title_for_researchers
      }
    end
  end

  def remove_researcher_from_study
    mail(
      to: params[:user].email_address,
      subject: "You've been removed from a study",
      template: 'remove_researcher'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name
      }
    end
  end

  def submit_study_for_review
    mail(
      to: 'kinetic@openstax.org',
      subject: 'Important: Access Request to Qualtrics',
      template: 'access_request_qualtrics'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      member = params[:study].members.first
      lead = params[:study].lead
      pi = params[:study].pi
      message.mailgun_variables = {
        'internal_study_details' => params[:study].title_for_researchers,
        'total_study_sessions' => params[:study].stages.size,
        'date_submitted' => Time.now.strftime('%B %d %Y at %I:%M %p'),
        'member_researcher_full_name' => "#{member.first_name} #{member.last_name}"
      }
      message.mailgun_variables[:lead_researcher_full_name] = "#{lead.first_name} #{lead.last_name}" unless lead.nil?
      message.mailgun_variables[:pi_researcher_full_name] = "#{pi.first_name} #{pi.last_name}" unless pi.nil?
    end
  end

  def send_report
    attachments['admin_report.csv'] = params[:csv]
    mail(
      to: params[:email],
      subject: 'Requested Admin Report'
    ) { |format| format.text { render plain: 'Attached is the requested admin report.' } }
  end
end
