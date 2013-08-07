class GameController < ApplicationController
	def show
		@endpoint = Challenge.offset(rand(Challenge.count)).first
	end
end