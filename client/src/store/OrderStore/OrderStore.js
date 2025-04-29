import {makeAutoObservable, runInAction} from "mobx";
import {
    GET_AVAILABLE_FLORIS_ORDERS,
    GET_AVAILABLE_ORDERS,
    GET_DELIVERYMAN_ORDERS,
    GET_USER_ORDERS,
    GET_ALL_ORDERS,
} from "@/graphql/queries";
import {CREATE_ORDER, TAKE_ORDER, UPDATE_ORDER_STATUS} from "@/graphql/mutations";

class OrderStore {
    userOrders = [];
    deliverymanOrders = [];
    availableOrders = [];
    allOrders = [];
    currentOrder = null;
    isLoading = false;
    error = null;
    pagination = {
        userOrders: {current: 1, pageSize: 10, total: 0},
        deliverymanOrders: {current: 1, pageSize: 10, total: 0},
        availableOrders: {current: 1, pageSize: 10, total: 0},
        allOrders: {current: 1, pageSize: 10, total: 0}
    };

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    // Общие методы
    setLoading = (isLoading) => {
        this.isLoading = isLoading;
    };

    setError = (error) => {
        this.error = error;
    };

    // Методы для пользователя
    async fetchUserOrders(status, pagination = {}) {
        this.setLoading(true);
        try {
            const userId = this.rootStore.authStore.currentUser.id;
            const {current = 1, pageSize = 10} = pagination;
            const offset = (current - 1) * pageSize;

            const {data} = await this.rootStore.client.query({
                query: GET_USER_ORDERS,
                variables: {userId, status, limit: pageSize, offset},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.userOrders = data.userOrders.nodes || [];
                this.pagination.userOrders = {
                    current,
                    pageSize,
                    total: data.userOrders.totalCount
                };
            });
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    // Методы для курьера
    async fetchDeliverymanOrders(status, pagination = {}) {
        this.setLoading(true);
        try {
            const deliverymanId = this.rootStore.authStore.currentUser.id;
            const {current = 1, pageSize = 10} = pagination;
            const offset = (current - 1) * pageSize;

            const {data} = await this.rootStore.client.query({
                query: GET_DELIVERYMAN_ORDERS,
                variables: {deliverymanId, status, limit: pageSize, offset},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.deliverymanOrders = data.deliverymanOrders.nodes || [];
                this.pagination.deliverymanOrders = {
                    current,
                    pageSize,
                    total: data.deliverymanOrders.totalCount
                };
            });
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async fetchAvailableOrders(pagination = {}) {
        this.setLoading(true);
        try {
            const {current = 1, pageSize = 10} = pagination;
            const offset = (current - 1) * pageSize;

            const {data} = await this.rootStore.client.query({
                query: GET_AVAILABLE_ORDERS,
                variables: {limit: pageSize, offset},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.availableOrders = data.availableDeliveryOrders.nodes || [];
                this.pagination.availableOrders = {
                    current,
                    pageSize,
                    total: data.availableDeliveryOrders.totalCount
                };
            });
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async fetchAvailableOrdersFloris(pagination = {}) {
        this.setLoading(true);
        try {
            const {current = 1, pageSize = 10} = pagination;
            const offset = (current - 1) * pageSize;

            const {data} = await this.rootStore.client.query({
                query: GET_AVAILABLE_FLORIS_ORDERS,
                variables: {limit: pageSize, offset},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.availableOrders = data.availableFloristOrders.nodes || [];
                this.pagination.availableOrders = {
                    current,
                    pageSize,
                    total: data.availableFloristOrders.totalCount
                };
            });
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async takeOrder(orderId) {
        this.setLoading(true);
        try {
            const deliverymanId = this.rootStore.authStore.currentUser.id;
            const {data} = await this.rootStore.client.mutate({
                mutation: TAKE_ORDER,
                variables: {orderId: parseInt(orderId), deliverymanId}
            });

            if (data.takeOrder.success) {
                runInAction(() => {
                    this.availableOrders = this.availableOrders.filter(o => o.id !== orderId);
                    this.deliverymanOrders.unshift(data.takeOrder.order);
                });
                this.fetchAvailableOrders()
                this.fetchDeliverymanOrders();
                return data.takeOrder.order;
            } else {
                throw new Error(data.takeOrder.message);
            }
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async updateOrderStatus(orderId, statusId) {
        this.setLoading(true);
        try {
            const {data} = await this.rootStore.client.mutate({
                mutation: UPDATE_ORDER_STATUS,
                variables: {orderId: parseInt(orderId), statusId: parseInt(statusId)}
            });

            runInAction(() => {
                // Update in deliveryman orders list
                const index = this.deliverymanOrders.findIndex(o => o.id === orderId);
                if (index !== -1) {
                    this.deliverymanOrders[index] = data.updateOrderStatus;
                }

                // Update current order if it's open
                if (this.currentOrder?.id === orderId) {
                    this.currentOrder = data.updateOrderStatus;
                }
            });

            return data.updateOrderStatus;
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async fetchOrderDetails(orderId) {
        this.setLoading(true);
        try {
            const {data} = await this.rootStore.client.query({
                query: GET_ORDER_DETAILS,
                variables: {orderId},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.currentOrder = data.orderById;
            });

            return data.orderById;
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async createOrder(orderData) {
        this.setLoading(true);
        try {
            const {data} = await this.rootStore.client.mutate({
                mutation: CREATE_ORDER,
                variables: {
                    input: {
                        userId: this.rootStore.authStore.currentUser.id,
                        ...orderData
                    }
                }
            });

            runInAction(() => {
                this.userOrders.unshift(data.createOrder);
                this.currentOrder = data.createOrder;
            });

            const updates = this.rootStore.authStore.cart.map(item => ({
                bouquetId: item.bouquet.id,
                operation: "delete"
            }));
            await this.rootStore.authStore.syncCart(updates);

            return data.createOrder;
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async fetchAllOrders(pagination = {}) {
        this.setLoading(true);
        try {
            const {current = 1, pageSize = 10} = pagination;
            const offset = (current - 1) * pageSize;

            const {data} = await this.rootStore.client.query({
                query: GET_ALL_ORDERS,
                variables: {limit: pageSize, offset},
                fetchPolicy: "network-only"
            });

            runInAction(() => {
                this.allOrders = data.allOrders.nodes || [];
                this.pagination.allOrders = {
                    current,
                    pageSize,
                    total: data.allOrders.totalCount
                };
            });
        } catch (error) {
            this.setError(error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
}

export default OrderStore;