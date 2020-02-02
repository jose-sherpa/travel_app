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

    before do
      post '/users', params: params
    end

    it 'returns 200' do
      expect(response).to have_http_status(200)
    end
  end
end
