# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Study, type: :model do
  let!(:opens_and_closes_study) { create(:study, title: 'a') }
  let!(:opens_and_closes_before_study) { create(:study, opens_at: 10.days.ago, closes_at: 3.days.ago, title: 'b') }
  let!(:opens_only_study) { create(:study, closes_at: nil, title: 'c') }
  let!(:opens_later_only_study) { create(:study, opens_at: 3.days.from_now, closes_at: nil, title: 'd') }
  let!(:no_times_study) { create(:study, opens_at: nil, closes_at: nil, title: 'e') }

  describe '#open' do
    it 'returns open studies' do
      expect_query_results(Study.open, [opens_and_closes_study, opens_only_study])
    end
  end

  def expect_query_results(query, results)
    expect(query.all.map(&:title_for_researchers)).to contain_exactly(
      *results.map(&:title_for_researchers)
    )
  end
end
