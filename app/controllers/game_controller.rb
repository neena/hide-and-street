class GameController < ApplicationController
	def show
		@endpoint = Endpoint.first
	end
end