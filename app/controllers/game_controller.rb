class GameController < ApplicationController
	def show
		@endpoint = Endpoint.first(:order => "RAND()")
	end
end