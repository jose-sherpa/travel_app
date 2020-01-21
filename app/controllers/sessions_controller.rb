class SessionsController < Devise::SessionsController
  include JwtManagement
  protect_from_forgery with: :null_session
  skip_before_action :verify_signed_out_user

  def create
    user = User.find_by(email: login_params[:email])
    if user.nil? || !user.valid_password?(login_params[:password])
      head 401
      return
    end

    self.resource = user

    session = UserSession.create(user: user)
    sign_in(resource_name, resource)
    render status: 200, json: { user: resource, token: create_token({ id: session.id })}
  end

  def destroy
    reset_session
    session = UserSession.find_by(id: token_payload&.dig('data', 'id'))
    #binding.pry
    session&.update(deleted: true)
    head 200
  end

  def set_cookie
    session = UserSession.active.find_by(id: token_payload&.dig('data', 'id'))

    if session.nil?
      reset_session
      head 401
      return
    end

    warden.env['rack.session']['user_session_id'] = session.id

    head 200
  end

  def get_token
    rack_session = warden.env['rack.session'] || {}
    session = UserSession.active.find_by(id: rack_session['user_session_id'])
    if session.nil?
      head 401
      return
    end

    render status: 200, json: { user: session.user, token: create_token(id: session.id)}
  end

  private

  def login_params
    params.require(:user).permit(:email, :password)
  end
end
