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
      subject: "You've been invited to a study",
      template: 'invite_researcher'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'researcher_full_name' => params[:researcher].full_name,
        'study_one_title' => params[:studies].first.title_for_participants,
        'study_two_title' => params[:studies].last.title_for_participants
      }
    end
  end

  def study_submitted_for_qualtrics_permissions
    mail(
      to: 'kinetic@kinetic.com',
      subject: "You've been invited to a study",
      template: 'invite_researcher'
    ) { |format| format.text { render plain: '' } }.tap do |message|
      message.mailgun_variables = {
        'full_name' => params[:user].full_name,
        'study_one_title' => params[:studies].first.title_for_participants,
        'study_two_title' => params[:studies].last.title_for_participants
      }
    end
  end


end
