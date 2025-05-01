import {action, makeObservable, observable} from 'mobx';
import {gql} from '@apollo/client';
import {searchAddress} from '../../lib/api';

class OCPStore {
    ocpList = [];
    isLoading = false;
    selectedOCP = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeObservable(this, {
            ocpList: observable,
            isLoading: observable,
            fetchAllOCPs: action,
            createOCP: action,
            assignDeliveryman: action,
            addItemToOCP: action,
        })
        this.fetchAllOCPs().then(r => {
        }).catch((e) => console.error(e));
    }

    // Получение всех OCP
    async fetchAllOCPs() {
        this.isLoading = true;
        try {
            const {data} = await this.rootStore.client.query({
                query: gql`
                    query GetAllOCPs {
                        allOcp {
                            id
                            address
                            createdAt
                            ocpItems {
                                id
                                amount
                                item {
                                    id
                                    name
                                }
                            }
                            deliverymen {
                                id
                                user {
                                    id
                                    username
                                }
                            }
                        }
                    }
                `,
                fetchPolicy: 'network-only'
            });
            this.ocpList = data.allOcp;
        } catch (error) {
            console.error('Error fetching OCPs:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Создание OCP
    async createOCP(address) {
        try {
            // Получаем координаты адреса
            const results = await searchAddress(address);
            
            if (!results || results.length === 0) {
                throw new Error('Не удалось определить координаты для указанного адреса');
            }

            const coordinates = results[0].coordinates;
            const formattedAddress = results[0].displayName;

            const {data} = await this.rootStore.client.mutate({
                mutation: gql`
                    mutation CreateOCP($address: String!, $latitude: Float, $longitude: Float) {
                        createOcp(
                                address: $address,
                                latitude: $latitude,
                                longitude: $longitude
                        ) {
                                id
                                address
                                latitude
                                longitude
                        }
                    }
                `,
                variables: {
                    address: formattedAddress,
                    latitude: coordinates.lat,
                    longitude: coordinates.lon
                }
            });
            await this.fetchAllOCPs();
            return data.createOcp;
        } catch (error) {
            console.error('Error creating OCP:', error);
            throw error;
        }
    }

    // Назначение доставщика
    async assignDeliveryman(ocpId, userId) {
        try {
            await this.rootStore.client.mutate({
                mutation: gql`
                    mutation AssignDeliveryman($ocpId: Int!, $userId: Int!) {
                        assignDeliveryman(ocpId: $ocpId, userId: $userId) {
                            id
                        }
                    }
                `,
                variables: {ocpId, userId}
            });
            await this.fetchAllOCPs();
        } catch (error) {
            console.error('Error assigning deliveryman:', error);
            throw error;
        }
    }

    // Добавление товара в OCP
    async addItemToOCP(ocpId, itemId, amount) {
        try {
            await this.rootStore.client.mutate({
                mutation: gql`
                    mutation AddItemToOCP($ocpId: Int!, $itemId: Int!, $amount: Int!) {
                        createOcpItem(ocpId: $ocpId, itemId: $itemId, amount: $amount) {
                            id
                        }
                    }
                `,
                variables: {ocpId, itemId, amount}
            });
            await this.fetchAllOCPs();
        } catch (error) {
            console.error('Error adding item to OCP:', error);
            throw error;
        }
    }
}

export default OCPStore;