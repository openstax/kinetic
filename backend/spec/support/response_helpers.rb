module ResponseHelpers
  def response_hash
    JSON.parse(response.body, symbolize_names: true)
  end
end
