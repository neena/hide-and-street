class ChallengesController < ApplicationController
	def show
		@endpoint = Challenge.find(params[:id])
	end
	def new 
		@challenge = Challenge.new
	end
	def create
		@challenge = Challenge.new(params.require(:challenge).permit(:pano))
		if @challenge.save
			redirect_to @challenge, notice: 'Challenge successful.'
		else
			render action: 'new'
		end
	end
end