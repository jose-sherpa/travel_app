require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  include_context('token auth')

  describe 'DELETE /users/sign_out' do
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }
    let(:jar) { ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash) }

    before do
      delete '/users/sign_out', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'deletes the session' do
      expect(UserSession.find_by(id: session.id)).to be_nil
    end

    it 'does not contain the auth in the cookie' do
      expect(jar.encrypted['_travel_app_session']['user_session_id']).to be_blank
      expect(jar.encrypted['_travel_app_session']['warden.user.user.key']).to be_blank
    end
  end
end
