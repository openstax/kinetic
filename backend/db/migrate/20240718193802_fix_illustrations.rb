class FixIllustrations < ActiveRecord::Migration[7.1]
  def up
    Study.transaction do
      updates = {
        19 => 'Mathematician-2--Streamline-Bangalore.svg',
        26 => 'Business-Go-To-Market-Strategy-01--Streamline-Bangalore.svg',
        32 => 'Bandaid-On-Heart-4--Streamline-Bangalore.svg',
        33 => 'Marketing-A-B-Testing-01--Streamline-Bangalore.svg',
      }

      updates.each do |id, image_id|
        study = Study.find_by(id: id)
        if study
          study.update(image_id: image_id)
        end
      end
    end
  end
end
