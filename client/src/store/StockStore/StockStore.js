import { gql } from '@apollo/client';
import { makeAutoObservable, runInAction } from 'mobx';

const GET_STOCK_ITEMS = gql`
    query GetStockItems($ocpId: Int!) {
        getStockItems(ocpId: $ocpId) {
            id
            name
            type
            cost
            amount
            ocpId
        }
    }
`;

const GET_TYPES = gql`
    query GetTypes {
        getAllTypes {
            id
            name
        }
    }
`;

const UPDATE_STOCK_ITEM = gql`
    mutation UpdateStockItem($id: Int!, $amount: Int!, $ocpId: Int!) {
        updateStockItem(id: $id, amount: $amount, ocpId: $ocpId) {
            success
            message
            stockItem {
                id
                name
                type
                cost
                amount
                ocpId
            }
        }
    }
`;

const CREATE_STOCK_ITEM = gql`
    mutation CreateStockItem($input: CreateStockItemInput!) {
        createStockItem(input: $input) {
            success
            message
            stockItem {
                id
                name
                type
                cost
                amount
                ocpId
            }
        }
    }
`;

const DELETE_STOCK_ITEM = gql`
    mutation DeleteStockItem($id: Int!, $ocpId: Int!) {
        deleteStockItem(id: $id, ocpId: $ocpId) {
            success
            message
        }
    }
`;

class StockStore {
    stockItems = [];
    itemTypes = [];
    isLoading = false;
    error = null;
    selectedOcpId = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.fetchItemTypes();
    }

    async fetchItemTypes() {
        try {
            const { data } = await this.rootStore.client.query({
                query: GET_TYPES,
                fetchPolicy: 'network-only'
            });
            runInAction(() => {
                this.itemTypes = data.getAllTypes || [];
            });
        } catch (error) {
            console.error('Error fetching item types:', error);
        }
    }

    setSelectedOcpId(id) {
        this.selectedOcpId = id;
        if (id) {
            this.fetchStockItems(id);
        } else {
            runInAction(() => {
                this.stockItems = [];
            });
        }
    }

    async fetchStockItems(ocpId) {
        if (!ocpId) return;
        
        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await this.rootStore.client.query({
                query: GET_STOCK_ITEMS,
                variables: { ocpId },
                fetchPolicy: 'network-only'
            });
            runInAction(() => {
                this.stockItems = data.getStockItems || [];
            });
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            console.error('Error fetching stock items:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async updateStockItem(id, amount) {
        if (!this.selectedOcpId) {
            throw new Error('Не выбран пункт сбора');
        }

        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await this.rootStore.client.mutate({
                mutation: UPDATE_STOCK_ITEM,
                variables: { 
                    id, 
                    amount,
                    ocpId: this.selectedOcpId
                }
            });

            runInAction(() => {
                if (data.updateStockItem.success) {
                    const index = this.stockItems.findIndex(item => item.id === id);
                    if (index !== -1) {
                        this.stockItems[index] = data.updateStockItem.stockItem;
                    }
                }
            });
            return data.updateStockItem;
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            console.error('Error updating stock item:', error);
            return { success: false, message: error.message };
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async createStockItem(itemData) {
        if (!this.selectedOcpId) {
            throw new Error('Не выбран пункт сбора');
        }

        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await this.rootStore.client.mutate({
                mutation: CREATE_STOCK_ITEM,
                variables: { 
                    input: {
                        ...itemData,
                        ocpId: this.selectedOcpId
                    }
                }
            });

            runInAction(() => {
                if (data.createStockItem.success) {
                    this.stockItems.push(data.createStockItem.stockItem);
                }
            });
            return data.createStockItem;
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            console.error('Error creating stock item:', error);
            return { success: false, message: error.message };
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async deleteStockItem(id) {
        if (!this.selectedOcpId) {
            throw new Error('Не выбран пункт сбора');
        }

        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await this.rootStore.client.mutate({
                mutation: DELETE_STOCK_ITEM,
                variables: { 
                    id,
                    ocpId: this.selectedOcpId
                }
            });

            if (data.deleteStockItem.success) {
                runInAction(() => {
                    this.stockItems = this.stockItems.filter(item => item.id !== id);
                });
            }
            return data.deleteStockItem;
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            console.error('Error deleting stock item:', error);
            return { success: false, message: error.message };
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}

export default StockStore; 