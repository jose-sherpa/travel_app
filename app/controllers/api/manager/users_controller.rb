module Api
  module Manager
    class UsersController < ::Api::ManagerController
      before_action :set_user, except: :index
      before_action :set_users, only: :index

      def index
        render status: 200, json: { users: @users }
      end

      def show
        render status: 200, json: { user: @user }
      end

      def destroy
        if @user.destroy
          head 200
        else
          render status: 422, json: { errors: @user.errors }
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def set_users
        @users = User.all.order(email: :asc)
      end
    end
  end
end
