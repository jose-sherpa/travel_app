# frozen_string_literal: true

module Api
  module Manager
    class UsersController < ::Api::ManagerController
      before_action :set_user, except: %i[index create]
      before_action :set_users, only: :index

      def index
        render status: 200, json: { users: @users }
      end

      def show
        render status: 200, json: { user: @user }
      end

      def create
        @user = User.new(user_params)

        if @user.save
          render status: 201, json: { user: @user }
        else
          render status: 422, json: { errors: @user.errors }
        end
      end

      def update
        if @user.update(user_params)
          render status: 200, json: { user: @user }
        else
          render status: 422, json: { errors: @user.errors }
        end
      end

      def destroy
        if @user.destroy
          head 200
        else
          render status: 422, json: { errors: @user.errors }
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

      def set_user
        @user = User.find(params[:id])
      end

      def set_users
        @users = User.all.order(email: :asc)
      end
    end
  end
end
