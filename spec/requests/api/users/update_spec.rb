require 'rails_helper'

RSpec.describe Api::UsersController, type: :request do
  include_context('token auth')

  describe 'PUT /api/user' do
    let(:user) { create(:user, password: current_password) }
    let(:session) { create(:user_session, user: user) }
    let(:email) { Faker::Internet.email }
    let(:password) { Faker::Internet.password(min_length: 8) }
    let(:password_confirmation) { password }
    let(:current_password) { Faker::Internet.password(min_length: 10) }
    let(:params) do
      {
        user: {
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          current_password: current_password
        }
      }
    end
    let(:headers) { api_token_header(session) }
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }
    let(:user_json) { JSON.parse(session.user.to_json, symbolize_names: true) }

    before do
      put '/api/user', headers: headers, params: params
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

    describe 'missing current password' do
      let(:user) { create(:user) }
      let(:current_password) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :current_password)).to be_present
      end
    end

    describe 'current password does not match' do
      let(:user) { create(:user) }
      let(:current_password) { Faker::Internet.password(min_length: 6) }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :current_password)).to be_present
      end
    end

    describe 'when posted with role' do
      let(:params) do
        {
          user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            current_password: current_password,
            role: 'manager'
          }
        }
      end

      before { user.reload }

      it 'does not save the role' do
        expect(user.role).to be_nil
      end
    end
  end
end
