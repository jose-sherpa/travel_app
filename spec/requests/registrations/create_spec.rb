require 'rails_helper'

RSpec.describe RegistrationsController, type: :request do
  describe 'POST /users' do
    let(:email) { Faker::Internet.email }
    let(:password) { Faker::Internet.password(min_length: 8) }
    let(:password_confirmation) { password }
    let(:params) do
      {
          user: {
              email: email,
              password: password,
              password_confirmation: password_confirmation
          }
      }
    end
    let(:parsed_body) { JSON.parse(response.body, symbolize_names: true) }

    before do
      post '/users', params: params
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns the correct location' do
      expect(parsed_body[:location]).to eq('/')
    end

    describe 'when posted with role' do
      let(:params) do
        {
            user: {
                email: email,
                password: password,
                password_confirmation: password_confirmation,
                role: 'manager'
            }
        }
      end

      it 'does not save the role' do
        expect(User.find_by(email: email).role).to be_nil
      end
    end

    describe 'missing email' do
      let(:email) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct location' do
        expect(parsed_body.dig(:errors, :email)).to be_present
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

    describe 'missing password' do
      let(:password) { nil }

      it 'returns 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns the correct errors' do
        expect(parsed_body.dig(:errors, :password)).to be_present
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
