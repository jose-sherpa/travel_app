module Api
  module Admin
    class TripsController < ::Api::AdminController
      before_action :set_user, only: %i[index create]
      before_action :set_trip, only: %i[show update destroy]

      def index
        @trips = Trip.where(user: @user).order(start_date: :asc)
        render status: 200, json: { trips: @trips }
      end

      def show
        render status: 200, json: { trip: @trip }
      end

      def create
        @trip = Trip.new(trip_params.merge(user: @user))

        if @trip.save
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
        @trip = Trip.find(params[:id])
      end

      def set_user
        @user = User.find(params[:user_id])
      end
    end
  end
end
