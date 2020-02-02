require 'rails_helper'

RSpec.describe Api::UsersController, type: :request do
  include_context('token auth')

  describe 'GET /api/user' do
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:user_json) { JSON.parse(session.user.to_json, symbolize_names: true) }

    before do
      get '/api/user', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:user]).to eq(user_json)
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
