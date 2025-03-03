import { makeObservable } from 'mobx';
import AuthStore from './AuthStore/AuthStore';
import FlowerStore from './FlowerStore/FlowerStore'

export default class RootStore {
  constructor() {
    makeObservable(this, {
    });
    this.authStore = new AuthStore(this);
    this.flowerStore = new FlowerStore(this);
  }
}
