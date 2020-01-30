import { action, computed } from "mobx";
import axios from "axios";
import { AuthStore } from "./AuthStore";
import NetworkStore from "./NetworkStore";

export default class RootStore extends NetworkStore {
  constructor() {
    super(new AuthStore());
  }

  @action.bound
  fetchToken(callback) {
    this.conn
      .get("/users/sessions/get_token")
      .then(
        action("fetchTokenSuccess", response => {
          const { data } = response;
          if (!data || !data.token) {
            throw new Error("no token");
          }
          this.apiKey = data.token;
          this.authStore.currentUser = data.user;
        })
      )
      .catch(error => console.log(error))
      .finally(() => {
        if (callback) callback();
      });
  }

  signup(email, password, passwordConfirmation) {
    return this.conn.post(
      "/users",
      {
        user: { email, password, password_confirmation: passwordConfirmation }
      },
      { validateStatus: status => status >= 200 && status < 500 }
    );
  }

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
  login(email, password, errorsCallback) {
    this.conn
      .post(
        "/users/sign_in",
        {
          user: {
            email: email,
            password: password
          }
        },
        {
          validateStatus: status => status >= 200 && status < 500
        }
      )
      .then(
        action("loginSuccess", response => {
          if (response.status >= 300) {
            if (errorsCallback) errorsCallback(response.data.errors);
            this.apiKey = null;
            this.authStore.currentUser = null;
            return;
          }

          const { data } = response;
          if (!data || !data.token) {
            throw new Error("no token present");
          }

          this.apiKey = data.token;
          this.authStore.currentUser = data.user;
        })
      )
      .catch(
        action("loginError", error => {
          this.apiKey = null;
          this.authStore.currentUser = null;
          console.log(error);
        })
      );
  }
}
