Rails.application.routes.draw do
  devise_scope :user do
    post '/users/sign_in', controller: :sessions, action: :create
    delete '/users/sign_out', controller: :sessions, action: :destroy
    get '/users/sessions/set_cookie', controller: :sessions, action: :set_cookie
    get '/users/sessions/get_token', controller: :sessions, action: :get_token
    post '/users', controller: :registrations, action: :create
    get '/users/confirmation', controller: :confirmations, action: :show
  end

  devise_for :users, skip: [
      :sessions
  ]

  namespace :api, defaults: { format: :json } do
    get '/trips/itinerary/:date', controller: :trips, action: :itinerary
    resources :trips, except: %i[new]
  end

  root controller: :react_app, action: :home

  get '*path', controller: :react_app, action: :home
end
