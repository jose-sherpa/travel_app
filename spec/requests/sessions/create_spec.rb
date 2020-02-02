require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  describe 'POST /users/sign_in' do
    let(:user) { create(:user, password: password) }
    let(:email) { user.email }
    let(:password) { Faker::Internet.password(min_length: 8) }
    let(:params) do
      {
        user: {
          email: email,
          password: password
        }
      }
    end
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }

    before do
      post '/users/sign_in', params: params
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:token]).to be_present
    end

    describe 'missing email' do
      let(:email) { nil }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end

      it 'returns the correct location' do
        expect(parsed_body.dig(:errors, :credentials)).to be_present
      end
    end

    describe 'missing password' do
      let(:user) { create(:user) }
      let(:password) { nil }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :credentials)).to be_present
      end
    end

    describe 'wrong password' do
      let(:user) { create(:user) }
      let(:password) { Faker::Internet.password(min_length: 6) }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :credentials)).to be_present
      end
    end
  end
end
