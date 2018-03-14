require 'bundler'
Bundler.require
require_all 'app'

ActiveRecord::Base.establish_connection(
  :adapter => "sqlite3",
  :database => "db/sushi"
)

ActiveRecord::Base.logger = Logger.new(STDOUT)