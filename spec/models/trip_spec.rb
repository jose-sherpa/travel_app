require 'rails_helper'

RSpec.describe Trip, type: :model do
  subject(:trip) { create(:trip) }

  describe 'validate_date_range' do
    let(:start_date) { Time.current }
    let(:end_date) { Time.current + 1.day }
    let(:result) do
      trip.update(
        start_date: start_date,
        end_date: end_date
      )
    end

    it 'succeeds' do
      expect(result).to eq(true)
    end

    describe 'when end date is before start date' do
      let(:end_date) { Time.current - 1.day }

      it 'fails' do
        expect(result).to eq(false)
      end
    end
  end
end
