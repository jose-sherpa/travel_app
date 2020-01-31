class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable #, :confirmable
  has_many :trips, dependent: :destroy
  has_many :user_sessions, dependent: :destroy
  validates :role, inclusion: %w[admin manager], unless: -> { role.nil? }
  validate :role_can_be_changed
  attr_accessor :current_user

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end

  private

  def role_can_be_changed
    return unless role_changed? || current_user&.admin?

    if role == 'admin' && current_user&.role != 'admin'
      errors.add(:role,
                 'you do not have permission to change this users role to that value')
    end
  end
end
