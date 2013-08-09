class GameController < ApplicationController
	def show
		@endpoint = Challenge.offset(rand(Challenge.count)).first
	end
	def leaderboard
		@leaders = User.all.sort_by{|user| user.score}.take(10)
	end
end