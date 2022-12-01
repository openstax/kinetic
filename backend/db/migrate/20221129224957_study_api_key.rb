class StudyApiKey < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          create or replace function random_string(int) returns text as $$
          select string_agg(substr(characters, (random() * length(characters) + 0.5)::integer, 1), '') as random_word
          from (values('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789')) as symbols(characters)
          join generate_series(1, $1) on 1 = 1
          $$ language sql;
        SQL
      end
      dir.down do
        execute 'drop function random_string(int)'
      end
    end

    add_column :studies, :api_key, :string, default: -> {'random_string(18)'}
  end
end
