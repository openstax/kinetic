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

          alter table studies add column api_key text not null default random_string(18);
        SQL
      end
      dir.down do
        execute <<-SQL
           alter table studies drop column api_key;
           drop function random_string(int);
        SQL
      end
    end


  end
end
