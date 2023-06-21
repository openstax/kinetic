# frozen_string_literal: true

require 'digest/md5'

class ResponseExport < ApplicationRecord
  belongs_to :stage
  after_create :ensure_fetched

  scope :for_cutoff, ->(cutoff) { where(arel_table[:cutoff_at].lteq(cutoff)) }

  def self.new_random_seed
    Random.new_seed
  end

  scope :pending, -> { where(is_complete: false) }

  has_many_attached :files

  def ensure_fetched
    return if is_complete?
    # TODO: kickoff and monitor Qualtrics download
    raise 'not yet implemented' unless is_testing

    generate_test_data
  end

  protected

  def file_attachment(file_name)
    md5sum = Digest::MD5.file(file_name).hexdigest
    ext = File.extname(file_name)
    {
      io: File.open(file_name),
      filename: "#{File.basename(file_name, ext)}-#{md5sum}#{ext}"
    }
  end

  def generate_test_data
    csvs = []
    seed = metadata[:random_seed] || self.class.new_random_seed
    generator_klass = case stage.config[:type]
                      when 'qualtrics'
                        QualtricsTestData
                      else
                        raise "Unsupported stage type: '#{stage.config[:type]}'"
                      end

    generator = generator_klass.new(stage: stage, random_seed: seed)
    csvs << generator.to_csv

    files.attach(csvs.map { |f| file_attachment(f.path) })
    update!(is_complete: true, metadata: metadata.merge(random_seed: seed))
  end

end
