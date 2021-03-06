module Api
  class TripsController < ::Api::ApplicationController
    before_action :set_trip, only: %i[show update destroy]

    def index
      @trips = Trip.where(user: current_user).order(start_date: :asc)
      render status: 200, json: { trips: @trips }
    end

    def itinerary
      start_of_month = DateTime.strptime(params[:date], '%Y-%m').to_date
      range = (start_of_month...start_of_month.end_of_month + 1.day)
      @trips = Trip.where(user: current_user)
                   .where('start_date <= ? AND end_date >= ?', range.first, range.first)
                   .or(Trip.where(start_date: range, user: current_user))
                   .order(start_date: :asc)
      render status: 200, json: { trips: @trips }
    rescue ArgumentError => e
      Rails.logger.info e
      head 422
    end

    def show
      render status: 200, json: { trip: @trip }
    end

    def create
      @trip = Trip.create(trip_params.merge(user: current_user))
      if @trip.persisted?
        render status: 201, json: { trip: @trip }
      else
        render status: 422, json: { errors: @trip.errors }
      end
    end

    def update
      if @trip.update(trip_params)
        render status: 200, json: { trip: @trip }
      else
        render status: 422, json: { errors: @trip.errors }
      end
    end

    def destroy
      @trip.destroy
      head 200
    end

    private

    def trip_params
      params.require(:trip).permit(:destination, :start_date, :end_date, :comment)
    end

    def set_trip
      @trip = current_user.trips.find(params[:id])
    end
  end
end
