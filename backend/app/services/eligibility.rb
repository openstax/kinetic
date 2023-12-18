# frozen_string_literal: true

class Eligibility

  def self.is_country_eligible?(country)
    country.blank? || Kinetic::ELIGIBLE_COUNTRY_CODES.include?(country)
  end

  def self.is_book_eligible?(book)
    book.blank? || !Kinetic::NON_ELIGIBLE_BOOKS.include?(book)
  end

end
