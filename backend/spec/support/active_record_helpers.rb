# frozen_string_literal: true

module ActiveRecordHelpers
  RSpec::Matchers.define :be_destroyed do |_expected|
    match do |actual|
      expect { actual.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
    match_when_negated do |actual|
      expect { actual.reload }.not_to raise_error
    end
    failure_message do |actual|
      "expected that #{actual} would be destroyed"
    end
    failure_message_when_negated do |actual|
      "expected that #{actual} would be not destroyed"
    end
  end
end
