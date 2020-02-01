import { action, computed, observable } from "mobx";
import NetworkStore from "./NetworkStore";

const validateStatus = status => status >= 200 && status < 500;

class AccountStore extends NetworkStore {
  @observable _user;

  constructor(authStore) {
    super(authStore);
    // this.user = Object.assign({}, authStore.currentUser);
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  set password(password) {
    this.user.password = password;
    if (!password) this.user.password_confirmation = null;
  }

  @action.bound
  fetchUser(callback) {
    this.conn
      .get(`/api/user`, { validateStatus })
      .then(response => {
        console.log(response);
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status >= 300) {
          throw new Error(`unacceptable status code ${response.status}`);
        }
        let { user } = response.data;
        user = { password: null, password_confirmation: null, ...user };
        this.user = user;
      })
      .catch(error => {
        console.log(error);
        this.user = null;
      })
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }

  @action.bound
  postUser(callback) {
    let user = this.user;
    const config = {
      validateStatus,
      data: { user }
    };

    console.log(user);
    this.conn
      .put(`/api/user`, {}, config)
      .then(response => {
        console.log(response);
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status === 404) {
          callback({ redirectTo: "/" });
        } else if (response.data.user) {
          callback({ redirectTo: `/account` });
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
  deleteUser(callback) {
    this.conn
      .delete(`/api/user`, { validateStatus })
      .catch(response => {
        if (response.status === 401) this.authStore.apiKey = null;
      })
      .finally(callback);
  }
}

export default AccountStore;
