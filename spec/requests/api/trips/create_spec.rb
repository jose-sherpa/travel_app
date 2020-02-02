require 'rails_helper'

RSpec.describe Api::TripsController, type: :request do
  include_context('token auth')
  include_context('json time')

  describe 'POST /api/trips' do
    let(:session) { create(:user_session) }
    let(:destination) { Faker::Address.city }
    let(:comment) { Faker::Lorem.paragraph }
    let(:start_date) { Time.current - 1.week }
    let(:end_date) { Time.current }
    let(:params) do
      {
        trip: {
          destination: destination,
          start_date: start_date,
          end_date: end_date,
          comment: comment
        }
      }
    end
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }

    before do
      post '/api/trips', headers: headers, params: params
    end

    it 'returns 200' do
      expect(response).to have_http_status(201)
    end

    it 'sets the destination' do
      expect(parsed_body.dig(:trip, :destination)).to eq(destination)
    end

    it 'sets the comment' do
      expect(parsed_body.dig(:trip, :comment)).to eq(comment)
    end

    it 'sets the start_date' do
      expect(parsed_body.dig(:trip, :start_date)).to eq(json_time(start_date))
    end

    it 'sets the end_date' do
      expect(parsed_body.dig(:trip, :end_date)).to eq(json_time(end_date))
    end

    describe 'when destination is nil' do
      let(:destination) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :destination)).to be_present
      end
    end

    describe 'when start_date is nil' do
      let(:start_date) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :start_date)).to be_present
      end
    end

    describe 'when end_date is nil' do
      let(:end_date) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :end_date)).to be_present
      end
    end

    describe 'when comment is nil' do
      let(:comment) { nil }

      it 'returns 200' do
        expect(response).to have_http_status(201)
      end

      it 'sets the comment' do
        expect(parsed_body.dig(:trip, :comment)).to eq(comment)
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
