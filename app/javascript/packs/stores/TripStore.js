import { action, computed, observable } from "mobx";
import NetworkStore from "./NetworkStore";

const validateStatus = status => status >= 200 && status < 500;

class TripStore extends NetworkStore {
  @observable trips = [];
  @observable trip;
  @observable user;

  constructor(authStore) {
    super(authStore);
  }

  @action.bound
  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
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
    const url = this.user?.id
      ? `/api/admin/users/${this.user.id}/trips`
      : "/api/trips";

    this.conn
      .get(url, { validateStatus })
      .then(response => {
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status >= 300) {
          throw new Error(`unacceptable status code ${response.status}`);
        }

        this.setTrips(response.data.trips);
      })
      .catch(error => {
        console.log(error);
        this.setTrips([]);
      })
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }

  @action.bound
  fetchTrip(id, callback) {
    const url = this.user?.id ? `/api/admin/trips/${id}` : `/api/trips/${id}`;
    this.conn
      .get(url, { validateStatus })
      .then(response => {
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status >= 300) {
          throw new Error(`unacceptable status code ${response.status}`);
        }

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
      validateStatus,
      data: { trip }
    };

    const userId = this.user?.id;
    const postUrl = userId ? `/api/admin/users/${userId}/trips` : "/api/trips";
    const putUrl = userId
      ? `/api/admin/trips/${trip.id}`
      : `/api/trips/${trip.id}`;

    let req = trip.id
      ? this.conn.put(putUrl, {}, config)
      : this.conn.post(postUrl, {}, config);
    req
      .then(response => {
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status === 404) {
          const redirect = userId ? `/admin/users/${userId}/trips` : "/trips";
          callback({ redirectTo: redirect });
        } else if (response.data.trip) {
          const redirect = userId
            ? `/admin/users/${userId}/trips/${response.data.trip.id}`
            : `/trips/${response.data.trip.id}`;
          callback({ redirectTo: redirect });
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
    const id = this.getTrip().id;
    const url = this.user?.id ? `/api/admin/trips/${id}` : `/api/trips/${id}`;
    this.conn
      .delete(url, { validateStatus })
      .catch(response => {
        if (response.status === 401) this.authStore.apiKey = null;
      })
      .finally(callback);
  }

  @action.bound
  fetchItinerary(startOfMonth, callback) {
    const nextMonth = startOfMonth.format("YYYY-MM");
    this.conn
      .get(`/api/trips/itinerary/${nextMonth}`, { validateStatus })
      .then(response => {
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status >= 300) {
          throw new Error(`unacceptable status code ${response.status}`);
        }

        this.setTrips(response.data.trips);
      })
      .catch(error => {
        console.log(error);
        this.setTrips([]);
      })
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }
}

export default TripStore;
