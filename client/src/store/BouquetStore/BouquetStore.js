import { makeObservable, observable, action, runInAction } from 'mobx';
import { CREATE_BOUQUET, DELETE_BOUQUET, UPDATE_BOUQUET } from '@/graphql/mutations';
import { GET_ALL_BOUQUETS } from '@/graphql/queries';

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
        });
        this.loadBouquets().then().catch(e => console.error(e));
    }

    // Метод для загрузки букетов
    async loadBouquets() {
        this.isLoading = true;
        try {
            const { data } = await this.rootStore.client.query({
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
            const { data: result } = await this.rootStore.client.mutate({
                mutation: CREATE_BOUQUET,
                variables: data,
            });
            runInAction(() => {
                this.bouquets.push(result.createBouquet.bouquet);
            });
        } catch (error) {
            console.error('Error creating bouquet:', error);
        }
    }

    // Метод для обновления букета
    async updateBouquet(id, data) {
        try {
            const { data: result } = await this.rootStore.client.mutate({
                mutation: UPDATE_BOUQUET,
                variables: { id, ...data },
            });
            runInAction(() => {
                const updatedBouqet = result.updateBouquetById.bouquet;
                const index = this.bouquets.findIndex(cat => cat.id === id);
                if (index !== -1) {
                    this.bouquets = [...this.bouquets.slice(0, index), updatedBouqet, ...this.bouquets.slice(index + 1)];
                }
            });
        } catch (error) {
            console.error('Error updating bouquet:', error);
        }
    }

    // Метод для удаления букета
    async deleteBouquet(id) {
        try {
            await this.rootStore.client.mutate({
                mutation: DELETE_BOUQUET,
                variables: { id },
            });
            runInAction(() => {
                this.bouquets = this.bouquets.filter((b) => b.id !== id);
            });
        } catch (error) {
            console.error('Error deleting bouquet:', error);
        }
    }
}