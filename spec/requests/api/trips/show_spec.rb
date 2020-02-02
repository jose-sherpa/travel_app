require 'rails_helper'

RSpec.describe Api::TripsController, type: :request do
  include_context('token auth')

  describe 'GET /api/trips/:id' do
    let(:trip) { create(:trip, user: session.user) }
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:trip_json) { JSON.parse(trip.to_json, symbolize_names: true) }

    before do
      get "/api/trips/#{trip.id}", headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:trip]).to eq(trip_json)
    end

    describe 'when trip does not belong to user' do
      let(:trip) { create(:trip) }

      it 'returns 404' do
        expect(response).to have_http_status(404)
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
