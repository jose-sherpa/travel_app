import { action, computed, observable } from "mobx";
import NetworkStore from "./NetworkStore";

class TripStore extends NetworkStore {
  @observable trips = [];
  @observable trip;

  constructor(authStore) {
    super(authStore);
  }

  getTrips() {
    return this.trips;
  }

  @action.bound
  setTrips(trips) {
    this.trips = trips || [];
  }

  findTrip(id) {
    return this.getTrips().find(trip => trip.id == id);
  }

  getTrip() {
    return this.trip;
  }

  @action.bound
  setTrip(trip) {
    this.trip = trip;
  }

  @action.bound
  fetchTrips(callback) {
    this.conn
      .get("/api/trips")
      .then(response => {
        console.log(response);
        this.setTrips(response.data.trips);
      })
      .catch(error => console.log(error))
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }

  @action.bound
  fetchTrip(id, callback) {
    this.conn
      .get(`/api/trips/${id}`)
      .then(response => {
        console.log(response);
        this.setTrip(response.data.trip);
      })
      .catch(error => {
        console.log(error);
        this.setTrip(null);
      })
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }

  @action.bound
  postTrip(callback) {
    let trip = this.getTrip();
    const config = {
      validateStatus: status => status >= 200 && status < 500,
      data: { trip }
    };

    let req = trip.id
      ? this.conn.put(`/api/trips/${trip.id}`, {}, config)
      : this.conn.post("/api/trips", {}, config);
    req
      .then(response => {
        console.log(response);
        if (response.status === 404) {
          callback({ redirectTo: "/trips" });
        } else if (response.data.trip) {
          callback({ redirectTo: `/trips/${response.data.trip.id}` });
        } else if (response.data.errors) {
          callback(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        callback({ error });
      });
  }

  @action.bound
  deleteTrip(callback) {
    this.conn.delete(`/api/trips/${this.getTrip().id}`).finally(callback);
  }
}

export default TripStore;
