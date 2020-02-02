require 'rails_helper'

RSpec.describe Api::Manager::UsersController, type: :request do
  include_context('token auth')

  describe 'GET /api/manager/users/:id' do
    let(:user) { create(:user, :as_admin) }
    let(:session) { create(:user_session, :as_admin) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:user_json) { JSON.parse(user.to_json, symbolize_names: true) }

    before do
      get "/api/manager/users/#{user.id}", headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:user]).to eq(user_json)
    end

    describe 'when current user is a manager' do
      let(:session) { create(:user_session, :as_manager) }

      describe 'when user is admin' do
        it 'returns 200' do
          expect(response).to have_http_status(200)
        end

        it 'returns the correct location' do
          expect(parsed_body[:user]).to eq(user_json)
        end
      end

      describe 'when user is manager' do
        let(:user) { create(:user, :as_manager) }

        it 'returns 200' do
          expect(response).to have_http_status(200)
        end

        it 'returns the correct location' do
          expect(parsed_body[:user]).to eq(user_json)
        end
      end
    end

    describe 'when current user has no role' do
      let(:session) { create(:user_session) }

      describe 'when user is admin' do
        it 'returns 403' do
          expect(response).to have_http_status(403)
        end
      end

      describe 'when user has no role' do
        let(:user) { create(:user) }

        it 'returns 200' do
          expect(response).to have_http_status(403)
        end
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
