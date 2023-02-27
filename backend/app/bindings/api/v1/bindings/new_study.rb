=begin
#OpenStax Kinetic API

#The Kinetic API for OpenStax.  Requests to this API should include `application/json` in the `Accept` header.  The desired API version is specified in the request URL, e.g. `[domain]/api/v1/researcher/studies`. While the API does support a default version, that version will change over time and therefore should not be used in production code! 

The version of the OpenAPI document: 0.1.0

Generated by: https://openapi-generator.tech
OpenAPI Generator version: 6.2.1

=end

require 'date'
require 'time'

module Api::V1::Bindings
  class NewStudy
    # The study name that participants see.
    attr_accessor :title_for_participants

    # The study name that only researchers see.
    attr_accessor :title_for_researchers

    # A short study description.
    attr_accessor :short_description

    # A long study description.
    attr_accessor :long_description

    # The tags of the study object, used for grouping and filtering.
    attr_accessor :tags

    # Description of feedback displayed to the user upon study completion
    attr_accessor :feedback_description

    # Freeform id of image that should be displayed on study card
    attr_accessor :image_id

    # Description of how the study benefits participants
    attr_accessor :benefits

    # Is the study hidden from participants
    attr_accessor :is_hidden

    # When the study opens for participation; null means not open.
    attr_accessor :opens_at

    # When the study closes for participation; null means does not close.
    attr_accessor :closes_at

    # Mandatory studies must be completed by all users
    attr_accessor :is_mandatory

    # Number of times this study has been completed
    attr_accessor :completed_count

    # Desired sample size set by researcher
    attr_accessor :target_sample_size

    # Status of the study
    attr_accessor :status

    class EnumAttributeValidator
      attr_reader :datatype
      attr_reader :allowable_values

      def initialize(datatype, allowable_values)
        @allowable_values = allowable_values.map do |value|
          case datatype.to_s
          when /Integer/i
            value.to_i
          when /Float/i
            value.to_f
          else
            value
          end
        end
      end

      def valid?(value)
        !value || allowable_values.include?(value)
      end
    end

    # Attribute mapping from ruby-style variable name to JSON key.
    def self.attribute_map
      {
        :'title_for_participants' => :'title_for_participants',
        :'title_for_researchers' => :'title_for_researchers',
        :'short_description' => :'short_description',
        :'long_description' => :'long_description',
        :'tags' => :'tags',
        :'feedback_description' => :'feedback_description',
        :'image_id' => :'image_id',
        :'benefits' => :'benefits',
        :'is_hidden' => :'is_hidden',
        :'opens_at' => :'opens_at',
        :'closes_at' => :'closes_at',
        :'is_mandatory' => :'is_mandatory',
        :'completed_count' => :'completed_count',
        :'target_sample_size' => :'target_sample_size',
        :'status' => :'status'
      }
    end

    # Returns all the JSON keys this model knows about
    def self.acceptable_attributes
      attribute_map.values
    end

    # Attribute type mapping.
    def self.openapi_types
      {
        :'title_for_participants' => :'String',
        :'title_for_researchers' => :'String',
        :'short_description' => :'String',
        :'long_description' => :'String',
        :'tags' => :'Array<String>',
        :'feedback_description' => :'String',
        :'image_id' => :'String',
        :'benefits' => :'String',
        :'is_hidden' => :'Boolean',
        :'opens_at' => :'Time',
        :'closes_at' => :'Time',
        :'is_mandatory' => :'Boolean',
        :'completed_count' => :'Float',
        :'target_sample_size' => :'Float',
        :'status' => :'String'
      }
    end

    # List of attributes with nullable: true
    def self.openapi_nullable
      Set.new([
        :'opens_at',
        :'closes_at',
      ])
    end

    # Initializes the object
    # @param [Hash] attributes Model attributes in the form of hash
    def initialize(attributes = {})
      if (!attributes.is_a?(Hash))
        fail ArgumentError, "The input argument (attributes) must be a hash in `Api::V1::Bindings::NewStudy` initialize method"
      end

      # check to see if the attribute exists and convert string to symbol for hash key
      attributes = attributes.each_with_object({}) { |(k, v), h|
        if (!self.class.attribute_map.key?(k.to_sym))
          fail ArgumentError, "`#{k}` is not a valid attribute in `Api::V1::Bindings::NewStudy`. Please check the name to make sure it's valid. List of attributes: " + self.class.attribute_map.keys.inspect
        end
        h[k.to_sym] = v
      }

      if attributes.key?(:'title_for_participants')
        self.title_for_participants = attributes[:'title_for_participants']
      end

      if attributes.key?(:'title_for_researchers')
        self.title_for_researchers = attributes[:'title_for_researchers']
      end

      if attributes.key?(:'short_description')
        self.short_description = attributes[:'short_description']
      end

      if attributes.key?(:'long_description')
        self.long_description = attributes[:'long_description']
      end

      if attributes.key?(:'tags')
        if (value = attributes[:'tags']).is_a?(Array)
          self.tags = value
        end
      end

      if attributes.key?(:'feedback_description')
        self.feedback_description = attributes[:'feedback_description']
      end

      if attributes.key?(:'image_id')
        self.image_id = attributes[:'image_id']
      end

      if attributes.key?(:'benefits')
        self.benefits = attributes[:'benefits']
      end

      if attributes.key?(:'is_hidden')
        self.is_hidden = attributes[:'is_hidden']
      end

      if attributes.key?(:'opens_at')
        self.opens_at = attributes[:'opens_at']
      end

      if attributes.key?(:'closes_at')
        self.closes_at = attributes[:'closes_at']
      end

      if attributes.key?(:'is_mandatory')
        self.is_mandatory = attributes[:'is_mandatory']
      end

      if attributes.key?(:'completed_count')
        self.completed_count = attributes[:'completed_count']
      end

      if attributes.key?(:'target_sample_size')
        self.target_sample_size = attributes[:'target_sample_size']
      end

      if attributes.key?(:'status')
        self.status = attributes[:'status']
      end
    end

    # Show invalid properties with the reasons. Usually used together with valid?
    # @return Array for valid properties with the reasons
    def list_invalid_properties
      invalid_properties = Array.new
      if @title_for_participants.nil?
        invalid_properties.push('invalid value for "title_for_participants", title_for_participants cannot be nil.')
      end

      if @title_for_participants.to_s.length < 1
        invalid_properties.push('invalid value for "title_for_participants", the character length must be great than or equal to 1.')
      end

      if !@title_for_researchers.nil? && @title_for_researchers.to_s.length < 1
        invalid_properties.push('invalid value for "title_for_researchers", the character length must be great than or equal to 1.')
      end

      if @short_description.nil?
        invalid_properties.push('invalid value for "short_description", short_description cannot be nil.')
      end

      if @tags.nil?
        invalid_properties.push('invalid value for "tags", tags cannot be nil.')
      end

      invalid_properties
    end

    # Check to see if the all the properties in the model are valid
    # @return true if the model is valid
    def valid?
      return false if @title_for_participants.nil?
      return false if @title_for_participants.to_s.length < 1
      return false if !@title_for_researchers.nil? && @title_for_researchers.to_s.length < 1
      return false if @short_description.nil?
      return false if @tags.nil?
      status_validator = EnumAttributeValidator.new('String', ["active", "paused", "scheduled", "draft", "completed"])
      return false unless status_validator.valid?(@status)
      true
    end

    # Custom attribute writer method with validation
    # @param [Object] title_for_participants Value to be assigned
    def title_for_participants=(title_for_participants)
      if title_for_participants.nil?
        fail ArgumentError, 'title_for_participants cannot be nil'
      end

      if title_for_participants.to_s.length < 1
        fail ArgumentError, 'invalid value for "title_for_participants", the character length must be great than or equal to 1.'
      end

      @title_for_participants = title_for_participants
    end

    # Custom attribute writer method with validation
    # @param [Object] title_for_researchers Value to be assigned
    def title_for_researchers=(title_for_researchers)
      if !title_for_researchers.nil? && title_for_researchers.to_s.length < 1
        fail ArgumentError, 'invalid value for "title_for_researchers", the character length must be great than or equal to 1.'
      end

      @title_for_researchers = title_for_researchers
    end

    # Custom attribute writer method with validation
    # @param [Object] tags Value to be assigned
    def tags=(tags)
      if tags.nil?
        fail ArgumentError, 'tags cannot be nil'
      end

      @tags = tags
    end

    # Custom attribute writer method checking allowed values (enum).
    # @param [Object] status Object to be assigned
    def status=(status)
      validator = EnumAttributeValidator.new('String', ["active", "paused", "scheduled", "draft", "completed"])
      unless validator.valid?(status)
        fail ArgumentError, "invalid value for \"status\", must be one of #{validator.allowable_values}."
      end
      @status = status
    end

    # Checks equality by comparing each attribute.
    # @param [Object] Object to be compared
    def ==(o)
      return true if self.equal?(o)
      self.class == o.class &&
          title_for_participants == o.title_for_participants &&
          title_for_researchers == o.title_for_researchers &&
          short_description == o.short_description &&
          long_description == o.long_description &&
          tags == o.tags &&
          feedback_description == o.feedback_description &&
          image_id == o.image_id &&
          benefits == o.benefits &&
          is_hidden == o.is_hidden &&
          opens_at == o.opens_at &&
          closes_at == o.closes_at &&
          is_mandatory == o.is_mandatory &&
          completed_count == o.completed_count &&
          target_sample_size == o.target_sample_size &&
          status == o.status
    end

    # @see the `==` method
    # @param [Object] Object to be compared
    def eql?(o)
      self == o
    end

    # Calculates hash code according to all attributes.
    # @return [Integer] Hash code
    def hash
      [title_for_participants, title_for_researchers, short_description, long_description, tags, feedback_description, image_id, benefits, is_hidden, opens_at, closes_at, is_mandatory, completed_count, target_sample_size, status].hash
    end

    # Builds the object from hash
    # @param [Hash] attributes Model attributes in the form of hash
    # @return [Object] Returns the model itself
    def self.build_from_hash(attributes)
      new.build_from_hash(attributes)
    end

    # Builds the object from hash
    # @param [Hash] attributes Model attributes in the form of hash
    # @return [Object] Returns the model itself
    def build_from_hash(attributes)
      return nil unless attributes.is_a?(Hash)
      attributes = attributes.transform_keys(&:to_sym)
      self.class.openapi_types.each_pair do |key, type|
        if attributes[self.class.attribute_map[key]].nil? && self.class.openapi_nullable.include?(key)
          self.send("#{key}=", nil)
        elsif type =~ /\AArray<(.*)>/i
          # check to ensure the input is an array given that the attribute
          # is documented as an array but the input is not
          if attributes[self.class.attribute_map[key]].is_a?(Array)
            self.send("#{key}=", attributes[self.class.attribute_map[key]].map { |v| _deserialize($1, v) })
          end
        elsif !attributes[self.class.attribute_map[key]].nil?
          self.send("#{key}=", _deserialize(type, attributes[self.class.attribute_map[key]]))
        end
      end

      self
    end

    # Deserializes the data based on type
    # @param string type Data type
    # @param string value Value to be deserialized
    # @return [Object] Deserialized data
    def _deserialize(type, value)
      case type.to_sym
      when :Time
        Time.parse(value)
      when :Date
        Date.parse(value)
      when :String
        value.to_s
      when :Integer
        value.to_i
      when :Float
        value.to_f
      when :Boolean
        if value.to_s =~ /\A(true|t|yes|y|1)\z/i
          true
        else
          false
        end
      when :Object
        # generic object (usually a Hash), return directly
        value
      when /\AArray<(?<inner_type>.+)>\z/
        inner_type = Regexp.last_match[:inner_type]
        value.map { |v| _deserialize(inner_type, v) }
      when /\AHash<(?<k_type>.+?), (?<v_type>.+)>\z/
        k_type = Regexp.last_match[:k_type]
        v_type = Regexp.last_match[:v_type]
        {}.tap do |hash|
          value.each do |k, v|
            hash[_deserialize(k_type, k)] = _deserialize(v_type, v)
          end
        end
      else # model
        # models (e.g. Pet) or oneOf
        klass = Api::V1::Bindings.const_get(type)
        klass.respond_to?(:openapi_one_of) ? klass.build(value) : klass.build_from_hash(value)
      end
    end

    # Returns the string representation of the object
    # @return [String] String presentation of the object
    def to_s
      to_hash.to_s
    end

    # to_body is an alias to to_hash (backward compatibility)
    # @return [Hash] Returns the object in the form of hash
    def to_body
      to_hash
    end

    # Returns the object in the form of hash
    # @return [Hash] Returns the object in the form of hash
    def to_hash
      hash = {}
      self.class.attribute_map.each_pair do |attr, param|
        value = self.send(attr)
        if value.nil?
          is_nullable = self.class.openapi_nullable.include?(attr)
          next if !is_nullable || (is_nullable && !instance_variable_defined?(:"@#{attr}"))
        end

        hash[param] = _to_hash(value)
      end
      hash
    end

    # Outputs non-array value in the form of hash
    # For object, use to_hash. Otherwise, just return the value
    # @param [Object] value Any valid value
    # @return [Hash] Returns the value in the form of hash
    def _to_hash(value)
      if value.is_a?(Array)
        value.compact.map { |v| _to_hash(v) }
      elsif value.is_a?(Hash)
        {}.tap do |hash|
          value.each { |k, v| hash[k] = _to_hash(v) }
        end
      elsif value.respond_to? :to_hash
        value.to_hash
      else
        value
      end
    end

  end

end
