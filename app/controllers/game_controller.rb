class GameController < ApplicationController
	def show
		@endpoint = Challenge.first
	end
end