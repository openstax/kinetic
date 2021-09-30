# frozen_string_literal: true

module UniqueToken
  CHARS = [('a'..'z'), ('A'..'Z'), (0..9)].map(&:to_a).flatten.without(
    'B', '8', 'G', '6', 'I', 'l', '1', 'O', '0', 'S', '5', 'Z', '2'
  )

  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def unique_token(token_field, options={})
      options[:length] ||= 16
      before_validation -> { generate_unique_token(token_field, options) }, prepend: true
      validates token_field, presence: true, uniqueness: true
    end
  end

  protected

  def generate_unique_token(field, options)
    return unless self[field].blank?

    loop do
      self[field] = UniqueToken::CHARS.sample(options[:length]).join
      break unless self.class.unscoped.exists?(field => self[field])
    end
  end
end

ActiveRecord::Base.include(UniqueToken)
