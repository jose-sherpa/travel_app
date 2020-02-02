require 'rails_helper'

RSpec.describe Api::Manager::UsersController, type: :request do
  include_context('token auth')

  describe 'POST /api/manager/users' do
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
    let(:user_json) { JSON.parse(user.to_json, symbolize_names: true) }

    before do
      post '/api/manager/users', headers: headers, params: params
    end

    it 'returns 201' do
      expect(response).to have_http_status(201)
    end

    it 'updates the email' do
      expect(parsed_body.dig(:user, :email)).to eq(email)
    end

    describe 'when no token is present' do
      let(:headers) { {} }

      it 'returns 401' do
        expect(response).to have_http_status(401)
      end
    end

    describe 'just email posted' do
      let(:params) do
        {
          user: {
            email: email,
          }
        }
      end

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :password)).to be_present
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

    describe 'when current user is a manager' do
      let(:session) { create(:user_session, :as_manager) }

      describe 'when user is manager' do
        let(:user) { create(:user, :as_manager) }

        it 'returns 201' do
          expect(response).to have_http_status(201)
        end

        it 'updates the email' do
          expect(parsed_body.dig(:user, :email)).to eq(email)
        end

        describe 'when trying to update role to admin' do
          let(:role) { 'admin' }

          it 'returns 403' do
            expect(response).to have_http_status(422)
          end

          it 'returns the correct errors' do
            expect(parsed_body.dig(:errors, :role)).to be_present
          end
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

        it 'returns 201' do
          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
