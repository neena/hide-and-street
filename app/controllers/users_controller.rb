class UsersController < ApplicationController
	def show
		if params[:id].to_i != 0
			@user = User.find(params[:id])
		else 
			@user = User.find_by_username(params[:id])
		end
		if @user.challenges.count > 0
			@endpoint = @user.challenges.offset(rand(@user.challenges.count)).first
		else
			@endpoint = Challenge.first
	end
end