# frozen_string_literal: true

# Monkey patch the generated Bindings for the swagger Highlight model

require 'will_paginate/array'

Rails.application.config.to_prepare do

  Api::V0::Bindings::NewHighlight.class_exec do
    def valid_location_strategies?
      location_strategies.present? &&
        location_strategies.none?(&:nil?) &&
        location_strategies.all?(&:valid?)
    end

    def location_strategies=(array)
      @location_strategies = array.map do |item|
        case item[:type]
        when 'TextPositionSelector'
          Api::V0::Bindings::TextPositionSelector.new(item)
        when 'XpathRangeSelector'
          Api::V0::Bindings::XpathRangeSelector.new(item)
        end
      end
    end

    alias_method :old_valid?, :valid?
    def valid?
      old_valid? && valid_location_strategies?
    end

    alias_method :old_list_invalid_properties, :list_invalid_properties
    def list_invalid_properties
      invalid_properties = old_list_invalid_properties

      if location_strategies.blank?
        invalid_properties.push('invalid value for "location_strategies", location_strategies cannot be empty.')
        return invalid_properties
      end

      if location_strategies.any?(&:nil?)
        invalid_properties.push('Empty or invalid strategy detected')
      end

      location_strategies.each do |strategy|
        next if strategy.nil?

        strategy.list_invalid_properties.each do |strategy_invalid_property|
          invalid_properties.push("invalid value for location strategy #{strategy.type}: #{strategy_invalid_property}")
        end
      end

      invalid_properties
    end
  end

  Api::V0::Bindings::NewHighlight.class_exec do
    def create_model!(user_id:)
      Highlight.create!(to_hash.merge(user_id: user_id))
    end
  end

  Api::V0::Bindings::Highlight.class_exec do
    def self.create_from_model(model)
      new(model.attributes)
    end

    def self.create_without_user_data(model)
      new(model.attributes.except('annotation'))
    end
  end

  Api::V0::Bindings::Highlights.class_exec do
    def self.create_from_query_result(query_result)
      highlights_bindings = query_result.map do |highlight|
        Api::V0::Bindings::Highlight.create_from_model(highlight)
      end

      new(
        meta: {
          page: query_result.current_page.to_i,
          per_page: query_result.per_page,
          total_count: query_result.total_entries,
          count: query_result.size
        },
        data: highlights_bindings
      )
    end
  end

  Api::V0::Bindings::GetHighlightsParameters.class_exec do
    def query(user_id:)
      highlights = get_highlights(user_id)

      if source_ids.present?
        # Sort the highlights in Ruby, not Postgres
        highlights = highlights.to_a

        source_id_order = source_ids.each_with_object({}).with_index do |(source_id, hash), index|
          hash[source_id] = index
        end

        highlights.sort_by! do |highlight|
          [source_id_order[highlight.source_id], highlight.order_in_source]
        end
      else
        # Have to sort by something for pagination to be sensible, choose created_at
        highlights.order(created_at: :desc)
      end

      highlights.paginate(
        page: page || Api::V0::HighlightsSwagger::DEFAULT_HIGHLIGHTS_PAGE,
        per_page: per_page || Api::V0::HighlightsSwagger::DEFAULT_HIGHLIGHTS_PER_PAGE
      )
    end
  end

  Api::V0::Bindings::HighlightUpdate.class_exec do
    def update_model!(model)
      model.color = color if color.present?
      model.annotation = annotation if annotation.is_a?(String)
      model.tap(&:save!)
    end
  end

  Api::V0::Bindings::GetHighlightsSummaryParameters.class_exec do
    def summarize(user_uuid:)
      results = get_highlights(user_uuid).group(:source_id, :color).count

      results.each_with_object({}) do |((source_id, color), source_color_count), scc|
        scc[source_id] ||= {}
        scc[source_id][color] = source_color_count
      end
    end
  end

  [
    Api::V0::Bindings::GetHighlightsParameters,
    Api::V0::Bindings::GetHighlightsSummaryParameters
  ].each do |klass|
    klass.class_exec do

      def get_highlights(user_id)
        filters = to_hash.except(:page, :per_page, :sets)
        filters[:user] = []

        if (sets.blank? || sets.include?('user:me')) && user_id.present?
          filters[:user].push(user_id)
        end

        raise NotAuthorized if (sets.blank? || sets.include?('user:me')) && !user_id.present?

        if sets.present? && sets.include?('curated:openstax') && scope_id.present?
          curator_scope = CuratorScope.find_by(scope_id: scope_id)
          filters[:user].push(curator_scope.curator_id) unless curator_scope.nil?
        end

        # if there is no curator, or user is logged out, its possible to not
        # have this filter, and if we don't handle it specially all highlights
        # will be returned
        return ::Highlight.none if filters[:user].empty?

        results = ::Highlight

        # The submitted GetHighlight properties create automatic chaining via
        # the by_X scopes on the Highlight model.
        filters.each do |key, value|
          results = results.public_send("by_#{key}", value) if value.present?
        end

        results
      end

      def invalid_colors
        colors.present? ? colors - Api::V0::HighlightsSwagger::VALID_HIGHLIGHT_COLORS : []
      end

      def valid_colors?
        invalid_colors.empty?
      end

      def invalid_sets
        sets.present? ? sets - Api::V0::HighlightsSwagger::VALID_SETS : []
      end

      def valid_sets?
        invalid_sets.empty?
      end

      alias_method :old_valid?, :valid?
      def valid?
        old_valid? && valid_colors? && valid_sets?
      end

      alias_method :old_list_invalid_properties, :list_invalid_properties
      def list_invalid_properties
        invalid_properties = old_list_invalid_properties

        if invalid_colors.any?
          invalid_properties.push("invalid value in \"colors\": #{invalid_colors.join(',')}")
        end
        if invalid_sets.any?
          invalid_properties.push("invalid value in \"sets\": #{invalid_sets.join(',')}")
        end

        invalid_properties
      end
    end
  end

  Api::V0::Bindings::HighlightsSummary.class_exec do
    def self.create_from_summary_result(summary_result)
      new(counts_per_source: summary_result)
    end
  end

end
