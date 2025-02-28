import { makeObservable } from 'mobx';
import AuthStore from './AuthStore/AuthStore';

export default class RootStore {

  constructor() {
    makeObservable(this, {
    });

    this.authStore = new AuthStore(this);
  }
}
