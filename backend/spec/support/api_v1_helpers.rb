# frozen_string_literal: true

module ApiV1Helpers
  def self.included(base)
    base.extend(ClassMethods)
  end

  def self.more_rspec_config(config)
    config.before(:example, api: :v0) do
      clear_headers
    end
  end

  def set_admin_api_token
    set_api_token(Rails.application.secrets.admin_api_token)
  end

  def set_bad_admin_api_token
    set_api_token('intentionally_bad_value')
  end

  def controller_spec?
    self.class.metadata[:type] == :controller
  end

  def request_spec?
    self.class.metadata[:type] == :request
  end

  def set_api_token(value)
    set_authorization_header("Token #{value}")
  end

  def clear_api_token
    header_hash.delete('Authorization') if header_hash['Authorization'].try(:starts_with?, 'Token')
  end

  def clear_api_id
    header_hash.delete('Authorization') if header_hash['Authorization'].try(:starts_with?, 'ID')
  end

  def clear_origin
    set_origin(nil)
  end

  def set_authorization_header(value)
    set_header('Authorization', value)
  end

  def set_header(key, value)
    header_hash[key] = value
  end

  def header_hash
    if controller_spec?
      @request.headers
    elsif request_spec?
      headers
    end
  end

  def set_origin(value)
    set_header('origin', value)
  end

  def headers
    @headers ||= {}
  end

  def clear_headers
    @headers = nil
  end

  def api_post(*args, &block)
    url, opts = prep_request_args(args)
    post(url, **opts, &block)
  end

  def api_get(*args, &block)
    url, opts = prep_request_args(args)
    get(url, **opts, &block)
  end

  def api_put(*args, &block)
    url, opts = prep_request_args(args)
    put(url, **opts, &block)
  end

  def api_delete(*args, &block)
    url, opts = prep_request_args(args)
    delete(url, **opts, &block)
  end

  def add_path_prefix(args)
    args.dup.tap { |copy| copy[0] = "/api/v0/#{copy[0]}" }
  end

  def prep_request_args(args)
    args.dup.tap do |copy|
      copy[0] = "/api/v0/#{copy[0]}"

      # Add the headers on to the end or merge them with existing hash
      headers['CONTENT_TYPE'] = 'application/json'

      if copy.length == 1
        copy.push({ headers: headers })
      elsif copy[1].is_a?(Hash)
        copy[1][:params] = copy[1][:params].to_json if copy[1][:params]
        copy[1][:headers] = headers.merge(copy[1][:headers] || {})
      else
        raise "Don't know what to do with this case"
      end
    end
  end

  def simple_api_request(verb, path)
    case verb
    when :get
      api_get(path)
    when :post
      api_post(path)
    when :put
      api_put(path)
    when :delete
      api_delete(path)
    else
      raise "Unknown verb #{verb}"
    end
  end

  module ClassMethods
    def test_request_status(spec, verb, path, status)
      spec.it "returns #{status} for #{verb} on path /api/v0/#{path}" do
        simple_api_request(verb, path)
        expect(response).to have_http_status(status)
      end
    end

    def test_crud_request_status(spec, route_prefix, status, actions)
      test_request_status(spec, :post, route_prefix.to_s, status) if create?(actions)
      test_request_status(spec, :get, "#{route_prefix}/42", status) if show?(actions)
      test_request_status(spec, :get, route_prefix.to_s, status) if index?(actions)
      test_request_status(spec, :put, "#{route_prefix}/42", status) if update?(actions)
      test_request_status(spec, :delete, "#{route_prefix}/42", status) if destroy?(actions)
    end
  end
end
