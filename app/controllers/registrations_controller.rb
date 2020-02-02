# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  include DisableForgeryProtection
  # protect_from_forgery with: :null_session
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    permitted = sign_up_params
    permitted[:password_confirmation] ||= '' unless permitted[:password].nil?

    build_resource(permitted)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render status: 200, json: {
          user: resource,
          location: after_sign_up_path_for(resource),
          message: find_message(:signed_up)
        }
      else
        expire_data_after_sign_in!
        render status: 200, json: {
          user: resource,
          location: after_inactive_sign_up_path_for(resource),
          message: find_message(:"signed_up_but_#{resource.inactive_message}")
        }
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render status: 422, json: { user: resource, errors: resource.errors }
    end
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
