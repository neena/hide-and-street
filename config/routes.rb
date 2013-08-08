HideAndStreet::Application.routes.draw do
  devise_for :users
  root 'game#show'
  resources :challenges do 
  	get :complete, :on => :member
  end
  resources :users, :only => [:show]
end
