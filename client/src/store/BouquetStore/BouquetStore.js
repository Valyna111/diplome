import { makeObservable, observable, action } from 'mobx';

export default class BouquetStore {
    bouquets = [];

    constructor(rootStore) {
        this.rootStore = rootStore;

        makeObservable(this, {
            bouquets: observable,
        });
    }

}