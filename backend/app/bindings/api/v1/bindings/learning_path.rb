=begin
#OpenStax Kinetic API

#The Kinetic API for OpenStax.  Requests to this API should include `application/json` in the `Accept` header.  The desired API version is specified in the request URL, e.g. `[domain]/api/v1/researcher/studies`. While the API does support a default version, that version will change over time and therefore should not be used in production code! 

The version of the OpenAPI document: 0.1.0

Generated by: https://openapi-generator.tech
OpenAPI Generator version: 6.6.0

=end

require 'date'
require 'time'

module Api::V1::Bindings
  class LearningPath
    # The learning path ID
    attr_accessor :id

    # The learning path rendering order
    attr_accessor :order

    # Learning path label
    attr_accessor :label

    # Learning path description
    attr_accessor :description

    # Learning path color
    attr_accessor :color

    # Level 1 metadata
    attr_accessor :level_1_metadata

    # Level 2 metadata
    attr_accessor :level_2_metadata

    # Open badge factory badge_id value
    attr_accessor :badge_id

    attr_accessor :badge

    # Has the user completed this learning path?
    attr_accessor :completed

    # Studies with this learning path
    attr_accessor :studies

    # Attribute mapping from ruby-style variable name to JSON key.
    def self.attribute_map
      {
        :'id' => :'id',
        :'order' => :'order',
        :'label' => :'label',
        :'description' => :'description',
        :'color' => :'color',
        :'level_1_metadata' => :'level_1_metadata',
        :'level_2_metadata' => :'level_2_metadata',
        :'badge_id' => :'badge_id',
        :'badge' => :'badge',
        :'completed' => :'completed',
        :'studies' => :'studies'
      }
    end

    # Returns all the JSON keys this model knows about
    def self.acceptable_attributes
      attribute_map.values
    end

    # Attribute type mapping.
    def self.openapi_types
      {
        :'id' => :'Float',
        :'order' => :'Float',
        :'label' => :'String',
        :'description' => :'String',
        :'color' => :'String',
        :'level_1_metadata' => :'Array<String>',
        :'level_2_metadata' => :'Array<String>',
        :'badge_id' => :'String',
        :'badge' => :'Badge',
        :'completed' => :'Boolean',
        :'studies' => :'Array<Study>'
      }
    end

    # List of attributes with nullable: true
    def self.openapi_nullable
      Set.new([
      ])
    end

    # Initializes the object
    # @param [Hash] attributes Model attributes in the form of hash
    def initialize(attributes = {})
      if (!attributes.is_a?(Hash))
        fail ArgumentError, "The input argument (attributes) must be a hash in `Api::V1::Bindings::LearningPath` initialize method"
      end

      # check to see if the attribute exists and convert string to symbol for hash key
      attributes = attributes.each_with_object({}) { |(k, v), h|
        if (!self.class.attribute_map.key?(k.to_sym))
          fail ArgumentError, "`#{k}` is not a valid attribute in `Api::V1::Bindings::LearningPath`. Please check the name to make sure it's valid. List of attributes: " + self.class.attribute_map.keys.inspect
        end
        h[k.to_sym] = v
      }

      if attributes.key?(:'id')
        self.id = attributes[:'id']
      end

      if attributes.key?(:'order')
        self.order = attributes[:'order']
      end

      if attributes.key?(:'label')
        self.label = attributes[:'label']
      end

      if attributes.key?(:'description')
        self.description = attributes[:'description']
      end

      if attributes.key?(:'color')
        self.color = attributes[:'color']
      end

      if attributes.key?(:'level_1_metadata')
        if (value = attributes[:'level_1_metadata']).is_a?(Array)
          self.level_1_metadata = value
        end
      end

      if attributes.key?(:'level_2_metadata')
        if (value = attributes[:'level_2_metadata']).is_a?(Array)
          self.level_2_metadata = value
        end
      end

      if attributes.key?(:'badge_id')
        self.badge_id = attributes[:'badge_id']
      end

      if attributes.key?(:'badge')
        self.badge = attributes[:'badge']
      end

      if attributes.key?(:'completed')
        self.completed = attributes[:'completed']
      end

      if attributes.key?(:'studies')
        if (value = attributes[:'studies']).is_a?(Array)
          self.studies = value
        end
      end
    end

    # Show invalid properties with the reasons. Usually used together with valid?
    # @return Array for valid properties with the reasons
    def list_invalid_properties
      invalid_properties = Array.new
      if @label.nil?
        invalid_properties.push('invalid value for "label", label cannot be nil.')
      end

      if @description.nil?
        invalid_properties.push('invalid value for "description", description cannot be nil.')
      end

      invalid_properties
    end

    # Check to see if the all the properties in the model are valid
    # @return true if the model is valid
    def valid?
      return false if @label.nil?
      return false if @description.nil?
      true
    end

    # Custom attribute writer method with validation
    # @param [Object] level_1_metadata Value to be assigned
    def level_1_metadata=(level_1_metadata)
      @level_1_metadata = level_1_metadata
    end

    # Custom attribute writer method with validation
    # @param [Object] level_2_metadata Value to be assigned
    def level_2_metadata=(level_2_metadata)
      @level_2_metadata = level_2_metadata
    end

    # Checks equality by comparing each attribute.
    # @param [Object] Object to be compared
    def ==(o)
      return true if self.equal?(o)
      self.class == o.class &&
          id == o.id &&
          order == o.order &&
          label == o.label &&
          description == o.description &&
          color == o.color &&
          level_1_metadata == o.level_1_metadata &&
          level_2_metadata == o.level_2_metadata &&
          badge_id == o.badge_id &&
          badge == o.badge &&
          completed == o.completed &&
          studies == o.studies
    end

    # @see the `==` method
    # @param [Object] Object to be compared
    def eql?(o)
      self == o
    end

    # Calculates hash code according to all attributes.
    # @return [Integer] Hash code
    def hash
      [id, order, label, description, color, level_1_metadata, level_2_metadata, badge_id, badge, completed, studies].hash
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
