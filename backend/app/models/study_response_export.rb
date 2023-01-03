# frozen_string_literal: true

require 'digest/md5'

class StudyResponseExport < ApplicationRecord
  belongs_to :study

  def self.new_random_seed
    Random.new_seed
  end

  scope :pending, -> { where(is_complete: false) }

  has_many_attached :files

  def fresh?
    is_complete && updated_at.after?(4.hours.ago)
  end

  def fetch
    return if is_complete?
    # TODO: kickoff and monitor Qualtrics download
    raise 'not yet implemented' unless is_testing

    generate_test_data
  end

  protected

  def attach_file(file)
    f = File.open(file)
    md5sum = Digest::MD5.hexdigest(f.read)
    f.rewind
    files.attach(io: f, filename: "#{md5sum}#{File.extname(file)}")
  ensure
    f.close
  end

  def generate_test_data
    files = []
    seed = metadata[:random_seed] || self.class.new_random_seed
    study.stages.each do |stage|
      generator_klass = case stage.config[:type]
                        when 'qualtrics'
                          QualtricsTestData
                        else
                          raise "Unsupported stage type: '#{stage.config[:type]}'"
                        end

      generator = generator_klass.new(stage: stage, random_seed: seed)

      files <<  generator.to_csv
    end
    files.each { |f| attach_file(f) }
    update!(is_complete: true, metadata: metadata.merge(random_seed: seed))
  end
end
