module Api
  class ManagerController < ::Api::ApplicationController
    before_action :authenticate_manager!

    private

    def authenticate_manager!
      raise Forbidden unless current_user.admin? || current_user.manager?
    end
  end
end
