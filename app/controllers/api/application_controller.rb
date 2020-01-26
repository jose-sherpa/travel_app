module Api
  class ApplicationController < ::ActionController::Base
    include JwtManagement
    include DisableForgeryProtection
    before_action :authenticate!

    class UnauthorizedRequest < StandardError; end

    rescue_from UnauthorizedRequest do
      head 401
    end

    rescue_from ActiveRecord::RecordNotFound do
      head 404
    end

    private

    def authenticate!
      session = UserSession.active.find_by(id: token_payload&.dig('data', 'id'))
      raise UnauthorizedRequest unless session.present?

      @current_user = session.user
    end
  end
end
