require 'rails_helper'

RSpec.describe Api::Admin::TripsController, type: :request do
  include_context('token auth')

  describe 'DELETE /api/admin/trips/:id' do
    let(:trip) { create(:trip) }
    let(:session) { create(:user_session, :as_admin) }
    let(:headers) { api_token_header(session) }

    before do
      delete "/api/admin/trips/#{trip.id}", headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'deletes the user' do
      expect(Trip.find_by(id: trip.id)).to be_nil
    end

    describe 'when current user is a manager' do
      let(:session) { create(:user_session, :as_manager) }

      it 'returns 403' do
        expect(response).to have_http_status(403)
      end
    end

    describe 'when current user has no role' do
      let(:session) { create(:user_session) }

      it 'returns 403' do
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
