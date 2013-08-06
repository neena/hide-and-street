class GameController < ApplicationController
	def show
		@endpoint = Endpoint.first(:order => "RANDOM()")
	end
end