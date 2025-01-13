# frozen_string_literal: true

require 'rufus-scheduler'
scheduler = Rufus::Scheduler.new

def populate_badges
  puts 'Starting the badge schedule'
  badges = OpenBadgeApi.instance.fetch_badges
  badge_ids = badges.map { |badge| badge['id'] }
  badge_ids.each do |id|
    OpenBadgeApi.instance.badge_info(id)
  end
  puts 'Fetched badges for the day'
end

def get_initiated_learning_path(user_id)
  initiated_learning_paths = LearningPath
                                 .joins(studies: :launched_studies)
                                 .where(studies: { is_hidden: false })
                                 .where(studies: { id: LaunchedStudy.where(user_id: user_id).pluck(:study_id) })
                                 .group('learning_paths.id')
                                 .having('COUNT(studies.id) > COUNT(launched_studies.completed_at)')
  if initiated_learning_paths.any?
    return initiated_learning_paths.first, true
  else
    initiated_learning_path_ids = LaunchedStudy
                                    .where(user_id: user_id)
                                    .joins(:study)
                                    .pluck('studies.learning_path_id')

    selected_learning_path = LearningPath
                                .where.not(id: initiated_learning_path_ids)
                                .order('RANDOM()')
                                .limit(1)
                                .first
    return selected_learning_path, false
  end
end

def get_inactive_users
  user_ids = LaunchedStudy
  .where.not(completed_at: nil) # Only completed studies
  .where('completed_at >= ?', 60.days.ago) # Within the last 60 days
  .group(:user_id) # Group by user
  .having('COUNT(user_id) = 1') # Ensure it's their first study
  .pluck(:user_id)

  inactive_user_ids = UserPreferences
           .where(user_id: user_ids)
           .where('last_visited_at <= ?', 30.days.ago) # Inactive for 30+ days
           .where(nurturing_email_sent: false) # Haven't received email
           .pluck(:user_id)
  
  inactive_user_ids
end

def send_notification_to_inactive_users

  inactive_user_ids = get_inactive_users
  
  inactive_user_ids.each do |user_id|

    selected_learning_path, is_initiated = get_initiated_learning_path(user_id)

    if !selected_learning_path
      return
    end

    user_info = UserInfo.for_uuid(user_id)
    recipient = Struct.new(:email_address, :first_name).new(
        user_info['email_address'],
        user_info[:first_name]
      )

    UserMailer
      .with(
        user: recipient,
        initiated_learning_path: is_initiated ? selected_learning_path : nil,
        not_initiated_learning_path: !is_initiated ? selected_learning_path : nil
      )
      .nurturing_email
      .deliver_now

    preference = UserPreferences.find_by(user_id: user_id)
    preference.update!(nurturing_email_sent: true)
  end
end

# Run the job immediately
scheduler.in '30s' do
  populate_badges
end

# Then schedule it to run every 24 hours
scheduler.every '24h' do
  populate_badges
  send_notification_to_inactive_users
end
