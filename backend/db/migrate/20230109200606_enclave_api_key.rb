class EnclaveApiKey < ActiveRecord::Migration[6.1]
  def change
    remove_column :studies, :api_key, :string, default: -> { 'random_string(18)' }

    create_table :analyses do |t|
      t.text :title, :description, null: false
      t.text :repository_url, null: false
      t.text :api_key, default: -> { 'random_string(18)' }, unique: true, index: true

      t.timestamps
    end

    create_table :analysis_researchers do |t|
      t.references :researcher, null: false, foreign_key: true, index: true
      t.references :analysis, null: false, foreign_key: true
    end

    create_table :study_analyses do |t|
      t.references :study, null: false, foreign_key: true
      t.references :analysis, null: false, foreign_key: true
    end


    create_table :analysis_response_exports do |t|
      t.references :analysis, null: false, foreign_key: true
      t.boolean :is_complete, :is_empty, :is_testing, default: false

      t.jsonb :metadata, default: {}
      t.timestamps
    end

    reversible do |dir|
      dir.up do
        execute <<-SQL
            drop table if exists study_response_exports;
        SQL
      end
    end

  end


end
