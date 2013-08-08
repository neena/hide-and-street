class UsersController < ApplicationController
	def show
		if params[:id].to_i != 0
			@user = User.find(params[:id])
		else 
			@user = User.find_by_username(params[:id])
		end
		@endpoint = @user.challenges.offset(rand(Challenge.count)).first
	end
end