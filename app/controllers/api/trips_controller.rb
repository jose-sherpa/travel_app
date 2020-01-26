module Api
  class TripsController < ::Api::ApplicationController
    before_action :set_trip, only: %i[show update destroy]

    def index
      @trips = Trip.where(user: current_user).order(start_date: :asc)
      render status: 200, json: { trips: @trips }
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
