class CreateAnalyisRuns < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL

          create or replace function api_key(text, int) returns text as $$
          select $1 || '_' || string_agg(substr(characters, (random() * length(characters) + 0.5)::integer, 1), '') as random_word
          from (values('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789')) as symbols(characters)
          join generate_series(1, $2) on 1 = 1
          $$ language sql;

          alter table analyses alter column api_key set default api_key('an', 18);

        SQL
      end
      dir.down do
        execute <<-SQL
           alter table analyses alter column api_key set default random_string(18);

           drop function api_key(text, int);
        SQL
      end
    end

    create_table :analysis_run_messages do |t|
      t.references :analysis_run, null: false, index: true
      t.text :message, null: false
      t.integer :stage, :level, null: false
      t.timestamp :created_at
    end

    create_table :analysis_runs do |t|
      t.references :analysis, null: false, index: true

      t.text :api_key, null: false, default: -> { "api_key('rn', 18)" }, index: { unique: true }
      t.text :message, null: false
      #      t.jsonb :error_messages, default: {}
      t.jsonb :messages, default: {}
      t.boolean :did_succeed, default: false
      t.timestamp :started_at   # has finished_at vs updated_at
      t.timestamp :finished_at
    end
  end
end
