require 'rails_helper'

RSpec.describe Api::TripsController, type: :request do
  include_context('token auth')

  describe 'GET /api/trips' do
    let!(:trips) { Array.new(10).map { create(:trip, user: session.user) } }
    let(:session) { create(:user_session) }
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:trips_json) { JSON.parse(trips.to_json, symbolize_names: true) }

    before do
      10.times { create(:trip) }
      get '/api/trips', headers: headers
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the json' do
      expect(parsed_body[:trips]).to eq(trips_json)
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
