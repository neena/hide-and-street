HideAndStreet::Application.routes.draw do
  root 'game#show'
  resources :mobile
end
