class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable #, :confirmable
  has_many :trips, dependent: :destroy
  has_many :user_sessions, dependent: :destroy
  validates :role, inclusion: %w[admin manager], unless: -> { role.nil? }

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end
end
