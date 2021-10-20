# frozen_string_literal: true

RESEARCHERS = [
  '572cc58d-0ab7-4dd4-bd62-ef8a11033ec7' # kinetic-researcher-01@mailinator.com
].freeze

PARTICIPANTS = [
  '0a5cb583-d248-4daf-bfca-ad244e3c962b', # kinetic-student-01@mailinator.com
  '018fb377-d952-4f2b-8f30-c6fc5c4c5670', # kinetic-student-02@mailinator.com
  '4230d153-005b-4cb2-9df1-b9e5d0ac855f'  # kinetic-student-03@mailinator.com
].freeze

desc 'create demo user accounts if they do not exist'
task :'demo-users', [:path, :run_mode] => :environment do |_, args|
  RESEARCHERS.each do |uuid|
    Researcher.find_or_create_by(user_id: uuid)
  end
  # there's nothing to setup for participants, records are auto-created
  # Instead we need to clear any activity the uuid's may have created
  # so the study's can be re-launched by testers
  LaunchedStage.where(user_id: PARTICIPANTS).destroy_all
  LaunchedStudy.where(user_id: PARTICIPANTS).destroy_all
end
