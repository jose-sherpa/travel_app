require 'rails_helper'

RSpec.describe Api::Admin::TripsController, type: :request do
  include_context('token auth')

  describe 'GET /api/admin/trips/:id' do
    let(:trip) { create(:trip, user: user) }
    let(:user) { create(:user) }
    let(:session) { create(:user_session, :as_admin) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:trip_json) { JSON.parse(trip.to_json, symbolize_names: true) }

    before do
      get "/api/admin/trips/#{trip.id}", headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:trip]).to eq(trip_json)
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
