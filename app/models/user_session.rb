class UserSession < ApplicationRecord
  belongs_to :user
  scope :active, -> { where(deleted: false) }
end
