require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  include_context('token auth')

  describe 'GET /users/sessions/get_token' do
    let(:session) { create(:user_session) }
    let(:headers) do
      get '/users/sessions/set_cookie', headers: api_token_header(session)
      { Cookie: response.headers['Set-Cookie'] }
    end
    let(:parsed_body) do
      JSON.parse(response.body, symbolize_names: true)
    rescue JSON::ParserError
      {}
    end

    before do
      get '/users/sessions/get_token', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the token' do
      expect(parsed_body[:token]).to be_present
    end

    describe 'without cookie' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end

      it 'does not return a token' do
        expect(parsed_body[:token]).to be_nil
      end
    end
  end
end
