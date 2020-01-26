require 'cgi'
require 'json'
require 'active_support'

class ReactAppController < ApplicationController
  layout 'react_app'
  #before_action :authenticate_user!

  def home
    puts cookies.to_h
    puts cookies.encrypted['_travel_app_session']
    puts warden.env['rack.session'].to_h
    #puts cookies.encrypted['auth_test']
    #puts cookies['auth_test']
    #puts cookies.delete(:auth_test)
    #puts verify_and_decrypt_json_session_cookie(cookies.encrypted[:auth_test]) if cookies.encrypted[:auth_test]
    #cookies.encrypted[:auth_test] = { value: 'test1', domain: '0.0.0.0:5000' }
    #response.set_cookie(:auth_test, {
    #    value: 'test'
    #})
    #puts cookies.to_h
    #binding.pry
  end
end
