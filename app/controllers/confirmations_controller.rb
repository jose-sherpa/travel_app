# frozen_string_literal: true

class ConfirmationsController < Devise::ConfirmationsController
  include DisableForgeryProtection
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    yield resource if block_given?

    redirect = if resource.errors.empty?
                 "/users/login?notice=#{find_message(:confirmed)}"
               else
                 message = resource.errors.full_messages.first || 'there was an issue signing up'
                 "/users/signup?notice=#{message}"
               end

    redirect_to URI.escape(redirect)
  end

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end
  #
end
