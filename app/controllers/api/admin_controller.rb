module Api
  class AdminController < ::Api::ApplicationController
    before_action :authenticate_admin!

    private

    def authenticate_admin!
      raise Forbidden unless current_user.admin?
    end
  end
end