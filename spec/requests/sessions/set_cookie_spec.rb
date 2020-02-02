require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  include_context('token auth')

  describe 'DELETE /users/sign_out' do
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }
    let(:jar) { ActionDispatch::Cookies::CookieJar.build(request, response.cookies.to_hash) }

    before do
      get '/users/sessions/set_cookie', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'sets the session id' do
      expect(jar.encrypted['_travel_app_session']['user_session_id']).to eq(session.id)
    end

    it 'sets the warden key' do
      expect(jar.encrypted['_travel_app_session']['warden.user.user.key'].first.first).to eq(session.user_id)
    end

    describe 'when missing token' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end

    describe 'when session id does not exist' do
      let(:session) { build(:user_session, id: 0) }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end

      it 'does not contain the auth in the cookie' do
        expect(jar.encrypted['_travel_app_session']['user_session_id']).to be_blank
        expect(jar.encrypted['_travel_app_session']['warden.user.user.key']).to be_blank
      end
    end
  end
end
