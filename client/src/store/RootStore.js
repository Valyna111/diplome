import {makeObservable} from 'mobx';
import AuthStore from './AuthStore/AuthStore';
import AuxiliaryStore from '@/store/AuxiliaryStore/AuxiliaryStore'
import BouquetStore from '@/store/BouquetStore/BouquetStore'
import {ApolloClient, InMemoryCache} from "@apollo/client";
import OCPStore from "@/store/OCPStore/OCPStore";

export default class RootStore {
    constructor() {
        this.client = new ApolloClient({
            uri: 'http://localhost:4000/graphql',
            cache: new InMemoryCache(),
        });
        makeObservable(this, {});
        this.authStore = new AuthStore(this);
        this.auxiliaryStore = new AuxiliaryStore(this);
        this.bouquetStore = new BouquetStore(this);
        this.ocpStore = new OCPStore(this);
    }
}
