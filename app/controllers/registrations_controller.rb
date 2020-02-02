# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  include DisableForgeryProtection

  # POST /users
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
end
