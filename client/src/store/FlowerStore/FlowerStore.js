import { makeObservable, observable, action } from 'mobx';

export default class FlowerStore {
  currentFlower = null;
  flowers = [];
  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
        currentFlower: observable,
        setCurrentFlower: action,
        getFlower: action
    });
  }

  // LOAD FLOWER INSTEAD FROM SERVER MAYBE LOAD ALL OR ADD PAGINATIONS 

  async getFlower (id) {
    try {
        const flower = this.flowers.find((f) => f.id === id);
        if (flower) return flower;
        // GET METHOD ON SERVER
        return null; 
    }
    catch (e) {
        console.error(e);
    }
  };

  setCurrentFlower(input) {
    this.currentFlower = input;
  }

}