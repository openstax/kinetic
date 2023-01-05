require 'active_support/cache/database_store/migration'

class CreateCache < ActiveRecord::Migration[5.2]
  def up
    ActiveSupport::Cache::DatabaseStore::Migration.migrate(:up)
  end

  def down
    ActiveSupport::Cache::DatabaseStore::Migration.migrate(:down)
  end
end
