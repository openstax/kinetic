desc 'generate an api key for enclaves'
task :gen_api_key, [] do
  puts SimpleStructuredSecrets.new('e', 'c').generate
end
