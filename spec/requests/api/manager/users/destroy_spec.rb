require 'rails_helper'

RSpec.describe Api::Manager::UsersController, type: :request do
  include_context('token auth')

  describe 'DELETE /api/manager/users/:id' do
    let(:user) { create(:user, :as_admin) }
    let(:session) { create(:user_session, :as_admin) }
    let(:headers) { api_token_header(session) }

    before do
      delete "/api/manager/users/#{user.id}", headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'deletes the user' do
      expect(User.find_by(id: user.id)).to be_nil
    end

    describe 'when current user is a manager' do
      let(:session) { create(:user_session, :as_manager) }

      describe 'when user is admin' do
        it 'returns 403' do
          expect(response).to have_http_status(403)
        end
      end

      describe 'when user is manager' do
        let(:user) { create(:user, :as_manager) }

        it 'returns 200' do
          expect(response).to have_http_status(200)
        end

        it 'deletes the user' do
          expect(User.find_by(id: user.id)).to be_nil
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
