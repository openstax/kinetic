# frozen_string_literal: true

require 'digest/md5'

class ResponseExport < ApplicationRecord
  belongs_to :stage
  after_create :ensure_fetched

  scope :for_cutoff, ->(cutoff) { where(arel_table[:cutoff_at].lteq(cutoff)) }

  def self.new_random_seed
    Random.new_seed
  end

  scope :real, -> { where(is_testing: false) }
  scope :by_date, -> { order(created_at: :desc) }
  scope :pending, -> { where(is_complete: false) }
  scope :completed, -> { where(is_complete: true) }

  has_many_attached :files

  def ensure_fetched
    return if is_complete?

    is_testing ? generate_test_data : fetch_real_responses
  end

  def is_stale?(cutoff)
    created_at < cutoff
  end

  protected

  def fetch_real_responses
    # make sure we're not already fetching
    api = QualtricsApi.new
    latest = stage.response_exports.where.not(id:).real.completed.by_date.last

    progress_id = api.start_response_export(
      stage.config['survey_id'], latest&.cutoff_at, cutoff_at
    )

    # TODO: monitor this and move it to a background job if it takes more than a few seconds
    retries = 1
    loop do
      completion = api.check_export_completion(stage.config['survey_id'], progress_id)
      case completion['status']
      when 'failed', retries > 8
        update!(
          is_complete: false,
          metadata: metadata.merge(
            progress_id:, retries:,
            status: { failed_at: Time.now })
        )
        save!
        break
      when 'complete'
        complete_response_fetch(api, retries, completion)
        break
      else
        sleep(1.5**retries)
        retries += 1
      end
    end
  end

  def complete_response_fetch(api, retries, completion)
    api.fetch_export_file(stage.config['survey_id'], completion['fileId']) do |entry|
      files.attach({ io: StringIO.new(entry.get_input_stream.read), filename: entry.name })
    end

    update!(
      is_complete: true,
      metadata: metadata.merge(
        retries:,
        file_id: completion['fileId'],
        status: { completed_at: Time.now })
      )
  end

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

    generator = generator_klass.new(stage:, random_seed: seed)
    csvs << generator.to_csv

    files.attach(csvs.map { |f| file_attachment(f.path) })
    update!(is_complete: true, metadata: metadata.merge(random_seed: seed))
  end

end
