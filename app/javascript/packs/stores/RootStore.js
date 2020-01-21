import { action, computed } from "mobx";
import axios from "axios";
import { AuthStore } from "./AuthStore";

export default class RootStore {
  authStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.axios = axios.create();
  }

  get apiKey() {
    return this.authStore.apiKey;
  }

  set apiKey(value) {
    this.authStore.apiKey = value;
  }

  @computed
  get conn() {
    return axios.create({
      headers: {
        Authorization: `Token ${this.apiKey}`
      }
    });
  }

  @action.bound
  fetchToken() {
    this.conn
      .get("/users/sessions/get_token")
      .then(
        action("fetchTokenSuccess", response => {
          if (!response.data || !response.data.token) {
            throw new Error("no token");
          }
          this.apiKey = response.data.token;
        })
      )
      .catch(error => console.log(error));
  }

  @action.bound
  signup() {}

  @action.bound
  logout() {
    this.conn.delete("/users/sign_out").finally(
      action("afterLogout", () => {
        this.apiKey = null;
        this.authStore.currentUser = null;
      })
    );
  }

  @action.bound
  login(email, password) {
    this.conn
      .post("/users/sign_in", {
        user: {
          email: email,
          password: password
        }
      })
      .then(
        action("loginSuccess", response => {
          if (!response.data || !response.data.token) {
            throw new Error("no token present");
          }
          this.apiKey = response.data.token;
          this.authStore.currentUser = response.data.user;
        })
      )
      .catch(
        action("loginError", error => {
          self.props.rootStore.apiKey = null;
          console.log(error);
        })
      );
  }
}
