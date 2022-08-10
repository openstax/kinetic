class StudyBenefitFields < ActiveRecord::Migration[6.1]
  def change
    add_column :studies, :benefits, :string
    add_column :studies, :feedback_description, :string
    add_column :studies, :image_id, :string
  end
end
