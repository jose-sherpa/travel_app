# frozen_string_literal: true

module Api
  class UsersController < ::Api::ApplicationController
    def show
      render status: 200, json: { user: current_user }
    end

    def update
      if current_user.update(user_params)
        render status: 200, json: { user: current_user }
      else
        render status: 422, json: { errors: current_user.errors }
      end
    end

    def destroy
      if current_user.destroy
        head 200
      else
        render status: 422, json: { errors: current_user.errors }
      end
    end

    private

    def user_params
      permitted = params
                  .require(:user)
                  .permit(:email, :password, :password_confirmation, :role)

      if !permitted[:password].nil? && permitted[:password_confirmation].nil?
        permitted[:password_confirmation] = ''
      end

      permitted
    end
  end
end
