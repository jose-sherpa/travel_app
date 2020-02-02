require 'rails_helper'

RSpec.describe Api::Manager::UsersController, type: :request do
  include_context('token auth')

  describe 'GET /api/manager/users' do
    let!(:users) do
      arr = Array.new(10).map { create(:user) }
      arr << session.user
      arr.sort_by(&:email)
    end
    let(:session) { create(:user_session, :as_admin) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:users_json) { JSON.parse(users.to_json, symbolize_names: true) }

    before do
      get '/api/manager/users', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the json' do
      expect(parsed_body[:users]).to eq(users_json)
    end

    describe 'when user is a manager' do
      let(:session) { create(:user_session, :as_manager) }

      it 'returns 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns the json' do
        expect(parsed_body[:users]).to eq(users_json)
      end
    end

    describe 'when user has no role' do
      let(:session) { create(:user_session) }

      it 'returns 200' do
        expect(response).to have_http_status(403)
      end
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
