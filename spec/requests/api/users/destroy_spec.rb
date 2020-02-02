require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  include_context('token auth')

  describe 'DELETE /api/user' do
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }

    before do
      delete '/api/user', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'deletes the user' do
      expect(User.find_by(id: session.user_id)).to be_nil
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
