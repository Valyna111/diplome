import {action, makeObservable, observable, runInAction} from 'mobx';
import {
    CREATE_BOUQUET,
    CREATE_ITEM_IN_BOUQUET,
    DELETE_BOUQUET,
    DELETE_FLOWERS_IN_BOUQUET,
    UPDATE_BOUQUET
} from '@/graphql/mutations';
import {GET_ALL_BOUQUETS, GET_BOUQUET_BY_ID, GET_AVAILABLE_BOUQUET_QUANTITIES} from '@/graphql/queries';

export default class BouquetStore {
    bouquets = [];
    availableQuantities = {}; // Меняем Map на обычный объект
    isLoading = false;
    error = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeObservable(this, {
            bouquets: observable,
            availableQuantities: observable,
            isLoading: observable,
            error: observable,
            createBouquet: action,
            updateBouquet: action,
            deleteBouquet: action,
            loadBouquets: action,
            getBouquet: action,
            searchBouquets: action,
            updateAvailableQuantities: action,
            getAvailableQuantity: action,
        });
        this.loadBouquets().then().catch(e => console.error(e));
    }

    async getBouquet(id) {
        try {
            const {data: result} = await this.rootStore.client.query({
                query: GET_BOUQUET_BY_ID,
                variables: {
                    id
                },
            });
            const getBouquetById = result.bouquetById;
            runInAction(() => {
                const index = this.bouquets.findIndex(cat => cat.id === id);
                if (index !== -1) {
                    this.bouquets = [...this.bouquets.slice(0, index), getBouquetById, ...this.bouquets.slice(index + 1)];
                }
            });
            console.log(getBouquetById);
            return getBouquetById;
        } catch (error) {
            console.error(error);
        }
    }

    // Новый метод для обновления доступных количеств
    async updateAvailableQuantities(ocpId) {
        try {
            const {data} = await this.rootStore.client.query({
                query: GET_AVAILABLE_BOUQUET_QUANTITIES,
                variables: { ocpId },
                fetchPolicy: 'network-only'
            });

            runInAction(() => {
                this.availableQuantities = {}; // Очищаем старые значения
                data.getAvailableBouquetQuantities.forEach(({bouquetId, maxQuantity}) => {
                    this.availableQuantities[bouquetId] = maxQuantity;
                });
            });

            console.log('Updated quantities:', this.availableQuantities);
        } catch (error) {
            console.error('Error updating available quantities:', error);
        }
    }

    // Метод для получения доступного количества для конкретного букета
    getAvailableQuantity(bouquetId) {
        return this.availableQuantities[bouquetId] || 0;
    }

    // Метод для загрузки букетов
    async loadBouquets() {
        this.isLoading = true;
        try {
            console.log('Loading bouquets...');
            const {data} = await this.rootStore.client.query({
                query: GET_ALL_BOUQUETS,
                fetchPolicy: 'network-only',
            });

            runInAction(() => {
                this.bouquets = data?.allBouquets?.nodes || [];
            });

            // Если у пользователя есть привязанный OCP, загружаем доступные количества
            const currentUser = this.rootStore.authStore.currentUser;
            console.log('Current user:', currentUser);
            
            if (currentUser?.ocp_id) {
                console.log('Updating quantities for OCP:', currentUser.ocp_id);
                await this.updateAvailableQuantities(currentUser.ocp_id);
            } else {
                console.log('No OCP assigned to user, skipping quantity update');
            }
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
            throw new Error(`No bouquet found with id ${id}`);
        }

        try {
            if (isNew) {
                // Для нового букета - просто создаем все элементы
                await Promise.all(
                    items.map(item =>
                        this.rootStore.client.mutate({
                            mutation: CREATE_ITEM_IN_BOUQUET,
                            variables: {
                                itemId: item.id,
                                bouquetId: id,
                                amount: item.quantity,
                            },
                        })
                    )
                );
            } else {
                // Для существующего букета - синхронизируем изменения
                const currentItems = bouquet.items || [];

                // 1. Удаляем отсутствующие элементы
                const itemsToRemove = currentItems.filter(
                    currentItem => !items.some(item => item.id === currentItem.itemId)
                );

                await Promise.all(
                    itemsToRemove.map(item =>
                        this.rootStore.client.mutate({
                            mutation: DELETE_FLOWERS_IN_BOUQUET,
                            variables: {id: item.id},
                        })
                    )
                );

                // 2. Обновляем существующие или добавляем новые
                await Promise.all(
                    items.map(item => {
                        const existingItem = currentItems.find(ci => ci.itemId === item.id);

                        if (existingItem) {
                            // Обновляем количество, если изменилось
                            if (existingItem.amount !== item.quantity) {
                                return this.rootStore.client.mutate({
                                    mutation: gql`
                                        mutation UpdateItemsInBouquet($id: Int!, $amount: Int!) {
                                            updateItemsInBouquetById(input: {
                                                id: $id,
                                                itemsInBouquetPatch: { amount: $amount }
                                            }) {
                                                itemsInBouquet {
                                                    id
                                                    amount
                                                }
                                            }
                                        }
                                    `,
                                    variables: {
                                        id: existingItem.id,
                                        amount: item.quantity,
                                    },
                                });
                            }
                        } else {
                            // Добавляем новый элемент
                            return this.rootStore.client.mutate({
                                mutation: CREATE_ITEM_IN_BOUQUET,
                                variables: {
                                    itemId: item.id,
                                    bouquetId: id,
                                    amount: item.quantity,
                                },
                            });
                        }
                        return Promise.resolve();
                    })
                );
            }

            // Обновляем данные букета
            await this.getBouquet(id);
            return true;
        } catch (error) {
            console.error('Error updating bouquet items:', error);
            throw error;
        }
    }

    searchBouquets(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase();
        return this.bouquets.filter(bouquet => 
            bouquet.name.toLowerCase().includes(searchTerm) ||
            bouquet.description?.toLowerCase().includes(searchTerm)
        ).slice(0, 5); // Ограничиваем количество результатов
    }
}