require 'rails_helper'

RSpec.describe Api::Manager::UsersController, type: :request do
  include_context('token auth')

  describe 'PUT /api/manager/users/:id' do
    let(:user) { create(:user) }
    let(:session) { create(:user_session, :as_admin) }
    let(:email) { Faker::Internet.email }
    let(:password) { Faker::Internet.password(min_length: 8) }
    let(:password_confirmation) { password }
    let(:role) { nil }
    let(:params) do
      {
        user: {
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          role: role
        }
      }
    end
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:user_json) { JSON.parse(session.user.to_json, symbolize_names: true) }

    before do
      put "/api/manager/users/#{user.id}", headers: headers, params: params
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'updates the email' do
      expect(parsed_body.dig(:user, :email)).to eq(email)
    end

    it 'returns the id' do
      expect(parsed_body.dig(:user, :id)).to eq(user.id)
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end

    describe 'just email changed' do
      let(:params) do
        {
          user: {
            email: email,
          }
        }
      end

      it 'returns 200' do
        expect(response).to have_http_status(200)
      end

      it 'updates the email' do
        expect(parsed_body.dig(:user, :email)).to eq(email)
      end
    end

    describe 'email taken' do
      let(:email) { create(:user).email }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :email)).to be_present
      end
    end

    describe 'missing password confirmation' do
      let(:password_confirmation) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :password_confirmation)).to be_present
      end
    end

    describe 'password confirmation does not match' do
      let(:password_confirmation) { Faker::Internet.password(min_length: 6) }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :password_confirmation)).to be_present
      end
    end
  end
end
