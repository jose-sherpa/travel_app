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
          if (!response.data || !response.data.token) {
            throw new Error("no token");
          }
          this.apiKey = response.data.token;
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
      .post("/users/sign_in", {
        user: {
          email: email,
          password: password
        }
      }, {
          validateStatus: status => status >= 200 && status < 500,
      })
      .then(
        action("loginSuccess", response => {
          if (response.status >= 300) {
            if (errorsCallback) errorsCallback(response.data.errors);
            this.apiKey = null;
            return
          }
          
          if (!response.data || !response.data.token) {
            throw new Error("no token present");
          }

          this.apiKey = response.data.token;
          this.authStore.currentUser = response.data.user;
        })
      )
      .catch(
        action("loginError", error => {
          this.apiKey = null;
          console.log(error);
        })
      );
  }
}
