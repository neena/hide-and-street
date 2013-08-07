class ChallengesController < ApplicationController
	def show
		@endpoint = Challenge.find(params[:id])
	end
end