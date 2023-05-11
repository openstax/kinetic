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

  def upcoming_prize_cycle_deadline
    mail(
      to: params[:user].email_address,
      subject: 'Don’t miss out on an exciting prize!',
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
        'study_one_title' => params[:studies].first.title_for_participants,
        'study_two_title' => params[:studies].last.title_for_participants
      }
    end
  end

  def invite_researcher_to_study
    mail(
      to: params[:user].email_address,
      subject: "OpenStax Kinetic: You’ve been invited to collaborate on a study",
      template: 'researcher_collaboration_invite'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'researcher_firstName' => params[:user].first_name,
        'researcher_lastName' => params[:user].last_name,
        'internal_study_title' => '',
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
        'full_name' => params[:user].full_name,
      }
    end
  end

  def submit_study_for_review
    mail(
      to: 'kinetic@openstax.org',
      subject: "Important: Access Request to Qualtrics",
      template: 'access_request_qualtrics'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      debugger
      member = params[:study].members.first
      lead = params[:study].lead
      pi = params[:study].pi
      # creating_researcher = params[:study].researchers.find { |r| r.role == 'member'}
      message.mailgun_variables = {
        'internal_study_details' => params[:study].title_for_researchers,
        'total_study_sessions' => params[:study].stages.size,
        'date' => Time.now.strftime("%B %d %Y at %I:%M %p"),
        'member' => member.first_name + ' ' + member.last_name,
        'lead' => lead.first_name + ' ' + lead.last_name,
        'pi' => pi.first_name + ' ' + pi.last_name
      }
    end
  end

end
