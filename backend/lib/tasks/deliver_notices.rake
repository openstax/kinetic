# frozen_string_literal: true

namespace :deliver do

  desc 'send notificications to participants'
  task :notifications do
    UserNotifications.deliver!
  end

end
