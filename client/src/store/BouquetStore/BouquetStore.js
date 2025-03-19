import {action, makeObservable, observable, runInAction} from 'mobx';
import {CREATE_BOUQUET, CREATE_ITEM_IN_BOUQUET, DELETE_BOUQUET, UPDATE_BOUQUET} from '@/graphql/mutations';
import {GET_ALL_BOUQUETS, GET_BOUQUET_BY_ID} from '@/graphql/queries';

export default class BouquetStore {
    bouquets = [];
    isLoading = false;
    error = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeObservable(this, {
            bouquets: observable,
            isLoading: observable,
            error: observable,
            createBouquet: action,
            updateBouquet: action,
            deleteBouquet: action,
            loadBouquets: action,
            getBouquet: action,
        });
        this.loadBouquets().then().catch(e => console.error(e));
    }

    async getBouquet(id) {
        try {
            const {data: result} = await this.rootStore.client.query({
                query: GET_BOUQUET_BY_ID,
                variables: {
                    id
                }, // Чтобы всегда запрашивать свежие данные
            });
            const getBouquetById = result.bouquetById.bouquetById;
            runInAction(() => {
                const index = this.bouquets.findIndex(cat => cat.id === id);
                if (index !== -1) {
                    this.bouquets = [...this.bouquets.slice(0, index), getBouquetById, ...this.bouquets.slice(index + 1)];
                }
            });
            return getBouquetById;
        } catch (error) {
            console.error(error);
        }
    }

    // Метод для загрузки букетов
    async loadBouquets() {
        this.isLoading = true;
        try {
            const {data} = await this.rootStore.client.query({
                query: GET_ALL_BOUQUETS,
                fetchPolicy: 'network-only', // Чтобы всегда запрашивать свежие данные
            });
            runInAction(() => {
                this.bouquets = data?.allBouquets?.nodes || [];
            });
        } catch (error) {
            runInAction(() => {
                this.error = error;
                console.error('Error loading bouquets:', error);
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Метод для создания букета
    async createBouquet(data) {
        try {
            const {data: result} = await this.rootStore.client.mutate({
                mutation: CREATE_BOUQUET,
                variables: data,
            });
            const bouquet = result.createBouquet.bouquet;
            runInAction(() => {
                this.bouquets = [...this.bouquets, bouquet];
            });
            return bouquet;
        } catch (error) {
            console.error('Error creating bouquet:', error);
        }
    }

    // Метод для обновления букета
    async updateBouquet(id, data) {
        try {
            const {data: result} = await this.rootStore.client.mutate({
                mutation: UPDATE_BOUQUET,
                variables: {id, ...data},
            });
            const updatedBouquet = result.updateBouquetById.bouquet;
            runInAction(() => {
                const index = this.bouquets.findIndex(cat => cat.id === id);
                if (index !== -1) {
                    this.bouquets = [...this.bouquets.slice(0, index), updatedBouquet, ...this.bouquets.slice(index + 1)];
                }
            });
            return updatedBouquet;
        } catch (error) {
            console.error('Error updating bouquet:', error);
        }
    }

    // Метод для удаления букета
    async deleteBouquet(id) {
        try {
            await this.rootStore.client.mutate({
                mutation: DELETE_BOUQUET,
                variables: {id},
            });
            runInAction(() => {
                this.bouquets = this.bouquets.filter((b) => b.id !== id);
            });
        } catch (error) {
            console.error('Error deleting bouquet:', error);
        }
    }

    async updateItemsInBouquet(id, items, isNew) {
        const bouquet = this.bouquets.find(cat => cat.id === id);
        if (!bouquet) {
            return new Error(`No bouquet found with id ${id}`);
        }
        try {
            if (isNew) {
                items.forEach((item) => {
                    this.rootStore.client.mutate({
                        mutation: CREATE_ITEM_IN_BOUQUET,
                        variables: {
                            itemId: item.id,
                            bouquetId: id,
                            amount: item.quantity,
                        },
                    });
                })
                await this.getBouquet(id);
            } else {

            }
        } catch (error) {
            console.error('Error updating bouquet:', error);
        }
    }
}