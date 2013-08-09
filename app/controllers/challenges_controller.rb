class ChallengesController < ApplicationController
	def show
		@endpoint = Challenge.find(params[:id])
	end

	def new 
		@challenge = Challenge.new
	end

	def create
		@challenge = Challenge.new(params.require(:challenge).permit(:pano))
		@challenge.creator = current_user if user_signed_in?
		@challenge.seeker = User.find(params[:challenge][:seeker_id]) if params[:challenge][:seeker_id] != ""
		if @challenge.save
			redirect_to challenge_path(@challenge, :just_made => true)
		else
			render action: 'new'
		end
	end

	def update
		@challenge = Challenge.find(params[:id])
		@challenge.seeker = User.find_by_username(params[:challenge][:seeker])
		if @challenge.save
			redirect_to challenge_path(@challenge, :just_made => true)
		else 
			render :text => params
		end
	end

	def complete 
		current_user.complete_challenge!(Challenge.find(params[:id]), params[:score]) if user_signed_in? 
		render :text => "ok"
	end
end