import { action, computed, observable } from "mobx";
import NetworkStore from "./NetworkStore";

const validateStatus = status => status >= 200 && status < 500;

class UserStore extends NetworkStore {
  @observable _users = [];
  @observable _user;

  constructor(authStore) {
    super(authStore);
  }

  @computed
  get users() {
    return this._users;
  }

  set users(users) {
    this._users = users || [];
  }

  findUser(id) {
    return this.users.find(user => user.id == id);
  }

  @computed
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
  fetchUsers(callback) {
    this.conn
      .get("/api/manager/users", { validateStatus })
      .then(response => {
        console.log(response);
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status >= 300) {
          throw new Error(`unacceptable status code ${response.status}`);
        }

        this.users = response.data.users;
      })
      .catch(error => {
        console.log(error);
        this.users = [];
      })
      .finally(() => {
        if (callback) {
          callback();
        }
      });
  }

  @action.bound
  fetchUser(id, callback) {
    this.conn
      .get(`/api/manager/users/${id}`, { validateStatus })
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
    let req = user.id
      ? this.conn.put(`/api/manager/users/${user.id}`, {}, config)
      : this.conn.post("/api/manager/users", {}, config);
    req
      .then(response => {
        console.log(response);
        if (response.status === 401) {
          this.authStore.apiKey = null;
          return;
        }

        if (response.status === 404) {
          callback({ redirectTo: "/manager/users" });
        } else if (response.data.user) {
          callback({ redirectTo: `/manager/users/${response.data.user.id}` });
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
      .delete(`/api/manager/users/${this.user.id}`, { validateStatus })
      .catch(response => {
        if (response.status === 401) this.authStore.apiKey = null;
      })
      .finally(callback);
  }
}

export default UserStore;
