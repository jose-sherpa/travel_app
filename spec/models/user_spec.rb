require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { create(:user, password: password) }

  let(:password) { Faker::Internet.password(min_length: 6) }

  describe 'current_password_valid' do
    let(:current_password) { password }
    let(:new_password) { Faker::Internet.password(min_length: 8) }
    let(:result) do
      user.update(
          password: new_password,
          password_confirmation: new_password,
          current_password: current_password
      )
    end

    it 'succeeds' do
      expect(result).to eq(true)
    end

    describe 'when current password does not match' do
      let(:current_password) { Faker::Internet.password(min_length: 10) }

      it 'fails' do
        expect(result).to eq(false)
      end
    end

    describe 'when current password not present' do
      let(:current_password) { nil }

      it 'succeeds' do
        expect(result).to eq(true)
      end
    end
  end

  describe 'role_can_be_changed' do
    let(:current_user) { create(:user) }
    let(:role) {}
    let(:result) { user.update(role: role, current_user: current_user) }

    describe 'when role has not changed' do
      subject(:user) { create(:user, :as_admin, password: password) }

      let(:role) { 'admin' }

      it 'succeeds' do
        expect(result).to eq(true)
      end
    end

    describe 'when current user is manager' do
      let(:current_user) { create(:user, :as_manager) }

      describe 'changing role to manager' do
        let(:role) { 'manager' }

        it 'succeeds' do
          expect(result).to eq(true)
        end
      end

      describe 'changing role to admin' do
        let(:role) { 'admin' }

        it 'fails' do
          expect(result).to eq(false)
        end
      end

      describe 'changing role from admin' do
        subject(:user) { create(:user, :as_admin, password: password) }
        let(:role) { 'manager' }

        it 'fails' do
          expect(result).to eq(false)
        end
      end
    end

    describe 'when current user is admin' do
      let(:current_user) { create(:user, :as_admin) }

      describe 'changing role to manager' do
        let(:role) { 'manager' }

        it 'succeeds' do
          expect(result).to eq(true)
        end
      end

      describe 'changing role to admin' do
        let(:role) { 'admin' }

        it 'succeeds' do
          expect(result).to eq(true)
        end
      end

      describe 'changing role from admin' do
        subject(:user) { create(:user, :as_admin, password: password) }
        let(:role) { 'manager' }

        it 'succeeds' do
          expect(result).to eq(true)
        end
      end
    end
  end
end
