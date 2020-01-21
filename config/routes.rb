Rails.application.routes.draw do
  devise_for :users, controllers: {
      sessions: :sessions
  }

  devise_scope :user do
    get '/users/sessions/set_cookie', controller: :sessions, action: :set_cookie
    get '/users/sessions/get_token', controller: :sessions, action: :get_token
  end

  root controller: :react_app, action: :home

  get '*all', controller: :react_app, action: :home
end
