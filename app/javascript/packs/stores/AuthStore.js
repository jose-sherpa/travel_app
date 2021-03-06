import { observable } from "mobx";

export class AuthStore {
  @observable _apiKey = null;
  @observable user = null;

  constructor() {}

  get apiKey() {
    return this._apiKey;
  }

  set apiKey(value) {
    this._apiKey = value;
    fetch("/users/sessions/set_cookie", {
      headers: {
        Authorization: `Token ${value}`
      }
    })
      .then(response => {})
      .catch(error => {});
  }

  get currentUser() {
    return this.user;
  }

  set currentUser(value) {
    this.user = value;
  }
}
