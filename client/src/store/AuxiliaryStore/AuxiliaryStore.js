import { makeObservable, observable, action, runInAction } from 'mobx';
import {
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    CREATE_TYPE,
    UPDATE_TYPE,
    DELETE_TYPE,
    CREATE_ITEM,
    UPDATE_ITEM,
    DELETE_ITEM,
} from '@/graphql/mutations';
import { GET_ALL_TYPES, GET_ALL_CATEGORIES, GET_ALL_ITEMS } from '@/graphql/queries'; // Импортируем запросы для items

export default class AuxiliaryStore {
    items = []; // Добавляем массив для items
    types = [];
    categories = [];
    isLoading = false; // Состояние загрузки
    error = null; // Состояние ошибки

    ModalItemCategory = {
        isOpen: false,
        data: null,
        title: '',
        onOpen: ({ type = 'типа', id, action = 'Создание', name = '' }) => {
            try {
                this.ModalItemCategory.isOpen = true;
                this.ModalItemCategory.data = { type, id, action, name };
            } catch (error) {
                console.error(error);
            }
        },
        onSubmit: async ({ name }) => {
            try {
                let data = {};
                if (this.ModalItemCategory.data.action === 'Создание') {
                    if (this.ModalItemCategory.data.type === 'типа') {
                        data = await this.createType(name);
                    } else {
                        data = await this.createCategory(name);
                    }
                } else if (this.ModalItemCategory.data.action === 'Редактирование') {
                    if (this.ModalItemCategory.data.type === 'типа') {
                        data = await this.updateType(this.ModalItemCategory.data.id, name);
                    } else {
                        data = await this.updateCategory(this.ModalItemCategory.data.id, name);
                    }
                } else {
                    if (this.ModalItemCategory.data.type === 'типа') {
                        data = await this.deleteType(this.ModalItemCategory.data.id);
                    } else if (this.ModalItemCategory.data.type === 'компонент') {
                        data = await  this.deleteItem(this.ModalItemCategory.data.id);
                    } else {
                        data = await this.deleteCategory(this.ModalItemCategory.data.id);
                    }
                }
                this.ModalItemCategory.onClose();
                return data;
            } catch (error) {
                console.error(error);
                return new Error(error);
            }
        },
        onClose: () => {
            this.ModalItemCategory.isOpen = false;
            this.ModalItemCategory.data = null;
        },
    };

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.client = rootStore.client;

        makeObservable(this, {
            items: observable,
            types: observable,
            categories: observable,
            isLoading: observable,
            error: observable,
            ModalItemCategory: observable,
            createCategory: action,
            updateCategory: action,
            deleteCategory: action,
            createType: action,
            updateType: action,
            deleteType: action,
            createItem: action,
            updateItem: action,
            deleteItem: action,
            loadTypes: action,
            loadCategories: action,
            loadItems: action,
            initializeData: action,
        });

        // Инициализация данных при создании стора
        this.initializeData().then(r => {}).catch((e) => console.error(e));
    }

    // Метод для загрузки всех типов
    async loadTypes() {
        this.isLoading = true;
        try {
            const { data } = await this.client.query({
                query: GET_ALL_TYPES,
                fetchPolicy: 'network-only', // Чтобы всегда запрашивать свежие данные
            });
            this.types = data?.allTypes?.nodes || [];
        } catch (error) {
            this.error = error;
            console.error('Error loading types:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Метод для загрузки всех категорий
    async loadCategories() {
        this.isLoading = true;
        try {
            const { data } = await this.client.query({
                query: GET_ALL_CATEGORIES,
                fetchPolicy: 'network-only', // Чтобы всегда запрашивать свежие данные
            });
            this.categories = data?.allCategories?.nodes || [];
        } catch (error) {
            this.error = error;
            console.error('Error loading categories:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Метод для загрузки всех items
    async loadItems() {
        this.isLoading = true;
        try {
            const { data } = await this.client.query({
                query: GET_ALL_ITEMS,
                fetchPolicy: 'network-only', // Чтобы всегда запрашивать свежие данные
            });
            this.items = data?.allItems?.nodes || [];
        } catch (error) {
            this.error = error;
            console.error('Error loading items:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Метод для инициализации данных (загрузка типов, категорий и items)
    async initializeData() {
        await this.loadTypes();
        await this.loadCategories();
        await this.loadItems();
    }

    // Метод для создания категории
    async createCategory(name) {
        try {
            const { data } = await this.client.mutate({
                mutation: CREATE_CATEGORY,
                variables: { name },
            });
            runInAction(() => {
                const category = data?.createCategory.category;
                this.categories = [...this.categories, { id: category.id, name: category.name }];
            });
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    // Метод для обновления категории
    async updateCategory(id, name) {
        try {
            const { data } = await this.client.mutate({
                mutation: UPDATE_CATEGORY,
                variables: { id, name },
            });
            runInAction(() => {
                const updatedCategory = data.updateCategoryById.category;
                const index = this.categories.findIndex(cat => cat.id === id);
                if (index !== -1) {
                    this.categories = [...this.categories.slice(0, index), updatedCategory, ...this.categories.slice(index + 1)];
                }
            });
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }

    // Метод для удаления категории
    async deleteCategory(id) {
        try {
            await this.client.mutate({
                mutation: DELETE_CATEGORY,
                variables: { id },
            });
            runInAction(() => (this.categories = this.categories.filter(cat => cat.id !== id)));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    // Метод для создания типа
    async createType(name) {
        try {
            const { data } = await this.client.mutate({
                mutation: CREATE_TYPE,
                variables: { name },
            });
            runInAction(() => {
                const type = data?.createType.type;
                this.types = [...this.types, { id: type.id, name: type.name }];
            });
        } catch (error) {
            console.error('Error creating type:', error);
        }
    }

    // Метод для обновления типа
    async updateType(id, name) {
        try {
            const { data } = await this.client.mutate({
                mutation: UPDATE_TYPE,
                variables: { id, name },
            });
            runInAction(() => {
                const updatedType = data?.updateTypeById?.type;
                const index = this.types.findIndex(type => type.id === id);
                if (index !== -1) {
                    this.types = [...this.types.slice(0, index), updatedType, ...this.types.slice(index + 1)];
                }
            });
        } catch (error) {
            console.error('Error updating type:', error);
        }
    }

    // Метод для удаления типа
    async deleteType(id) {
        try {
            await this.client.mutate({
                mutation: DELETE_TYPE,
                variables: { id },
            });
            runInAction(() => (this.types = this.types.filter(type => type.id !== id)));
        } catch (error) {
            console.error('Error deleting type:', error);
        }
    }

    // Метод для создания item
    async createItem(name, typeId, cost) {
        try {
            console.log(name, typeId, cost);
            const { data } = await this.client.mutate({
                mutation: CREATE_ITEM,
                variables: { name, typeId, cost },
            });
            runInAction(() => {
                const item = data?.createItem.item;
                this.items = [...this.items, item];
            });
        } catch (error) {
            console.error('Error creating item:', error);
        }
    }

    // Метод для обновления item
    async updateItem(id, name, typeId, cost) {
        try {
            const { data } = await this.client.mutate({
                mutation: UPDATE_ITEM,
                variables: { id, name, typeId, cost },
            });
            runInAction(() => {
                const updatedItem = data?.updateItemById.item;
                const index = this.items.findIndex(item => item.id === id);
                if (index !== -1) {
                    this.items = [...this.items.slice(0, index), updatedItem, ...this.items.slice(index + 1)];
                }
            });
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    // Метод для удаления item
    async deleteItem(id) {
        try {
            await this.client.mutate({
                mutation: DELETE_ITEM,
                variables: { id },
            });
            runInAction(() => (this.items = this.items.filter(item => item.id !== id)));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
}