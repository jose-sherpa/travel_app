class Trip < ApplicationRecord
  belongs_to :user
  validates :user, :destination, :start_date, :end_date, presence: true
  validate :validate_date_range

  private

  def validate_date_range
    return if end_date.nil? || start_date.nil? || end_date >= start_date

    errors.add(:end_date, 'must be greater than or equal to the start date')
  end
end
