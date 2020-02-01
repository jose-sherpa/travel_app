# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable # , :confirmable
  has_many :trips, dependent: :destroy
  has_many :user_sessions, dependent: :destroy
  validates :role, inclusion: %w[admin manager], unless: -> { role.nil? }
  validate :role_can_be_changed
  validate :current_password_valid
  attr_accessor :current_user
  attr_writer :current_password

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end

  private

  def current_password_valid
    return if current_password.nil?

    pw = encrypted_password_was || encrypted_password
    valid = Devise::Encryptor.compare(self.class, pw, current_password)
    errors.add(:current_password, 'is invalid') unless valid
  end

  def role_can_be_changed
    return if !role_changed? || current_user&.admin?

    if role == 'admin' || role_was == 'admin'
      errors.add(:role,
                 'you do not have permission to change this users role to that value')
    end
  end
end
