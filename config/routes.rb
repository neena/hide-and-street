HideAndStreet::Application.routes.draw do
  devise_for :users
  root 'game#show'
  resources :challenges, :only => [:show]
end
