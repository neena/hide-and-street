class UsersController < ApplicationController
	def show
		@finder = params[:id].to_i
		if @finder != 0
			@user = User.find(params[:id])
		else 
			@user = User.find_by_username(params[:id])
		end
		@endpoint = @user.challenges.offset(rand(@user.challenges.count)).first
	end
end