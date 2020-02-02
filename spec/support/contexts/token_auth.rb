RSpec.shared_context 'token auth' do
  def api_token_header(user_session)
    token = api_token(user_session)
    api_header_for_token(token)
  end

  def api_header_for_token(token)
    { 'Authorization' => "Token #{token}" }
  end

  def api_token(user_session)
    SessionsController.new.create_token(user_session)
  end
end
