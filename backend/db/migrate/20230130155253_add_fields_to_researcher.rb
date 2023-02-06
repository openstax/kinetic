class AddFieldsToResearcher < ActiveRecord::Migration[6.1]
  def change
    add_column :researchers, :lab_page, :string
    add_column :researchers, :first_name, :string
    add_column :researchers, :last_name, :string
    add_column :researchers, :research_interest_1, :string
    add_column :researchers, :research_interest_2, :string
    add_column :researchers, :research_interest_3, :string
    add_column :researchers, :invite_code, :string

    reversible do |dir|
      dir.up do
        Researcher.find_each do | researcher |
          names = researcher.name.split(/ /, 2)
          researcher.update!(
            first_name: names[0],
            last_name: names[1]
          )
        end
      end

      dir.down do
        Researcher.find_each do | researcher |
          researcher.update!(
            name: (researcher.first_name || '') + ' ' + (researcher.last_name || '')
          )
        end
      end
    end

    remove_column :researchers, :name, :string
  end
end
