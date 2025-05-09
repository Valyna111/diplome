import {makeObservable} from 'mobx';
import AuthStore from './AuthStore/AuthStore';
import AuxiliaryStore from '@/store/AuxiliaryStore/AuxiliaryStore'
import BouquetStore from '@/store/BouquetStore/BouquetStore'
import client from '@/apolloClient';
import OCPStore from "@/store/OCPStore/OCPStore";
import OrderStore from "@/store/OrderStore/OrderStore";
import StockStore from './StockStore/StockStore';
import FeedbackStore from './FeedbackStore/FeedbackStore';

export default class RootStore {
    constructor() {
        this.client = client;
        makeObservable(this, {});
        this.authStore = new AuthStore(this);
        this.auxiliaryStore = new AuxiliaryStore(this);
        this.bouquetStore = new BouquetStore(this);
        this.ocpStore = new OCPStore(this);
        this.orderStore = new OrderStore(this);
        this.stockStore = new StockStore(this);
        this.feedbackStore = new FeedbackStore(this);
    }
}
