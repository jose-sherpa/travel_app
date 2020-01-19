class Trip < ApplicationRecord
  belongs_to :user
  validates :destination, :start_date, :end_date, presence: true
end
