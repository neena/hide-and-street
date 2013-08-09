HideAndStreet::Application.routes.draw do
  devise_for :users
  root 'game#show'
  get 'game/leaderboard'
  resources :challenges do 
  	post :complete, :on => :member
  end
  resources :users, :only => [:show]
end
