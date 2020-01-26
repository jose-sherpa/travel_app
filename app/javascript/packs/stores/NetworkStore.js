import { action, computed } from "mobx";
import axios from "axios";

export default class NetworkStore {
  authStore;

  constructor(authStore) {
    this.authStore = authStore
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
}
