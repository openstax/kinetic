# frozen_string_literal: true

# a minimal doorkeeper config
# Even though doorkeeper isn't used, it's pulled in by the account-rails gem
# and will blow up on production if a config isn't present
Doorkeeper.configure do
  orm :active_record
  api_only
end
