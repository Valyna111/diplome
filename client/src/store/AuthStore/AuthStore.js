import {BLOCK_USER, CLEAR_WISHLIST, SYNC_CART, TOGGLE_WISHLIST, UPDATE_USER, UPDATE_USER_ADDRESS} from '@/graphql/mutations';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {GET_ALL_USERS, GET_USER_RELATIVE_DATA} from "@/graphql/queries";
import { findNearestOCP, searchAddress } from '@/lib/api';
const BASE_URL = 'http://localhost:4000'; 

export default class AuthStore {
    currentUser = null;
    isLoading = true;
    isModalLogin = false;
    isModalRegister = false;
    isModalChangePassword = false;
    isModalForgotPassword = false;
    cart = [];
    wishlist = [];
    bonuses = [];
    isAddressModalOpen = false;
    users = []; // Добавляем список всех пользователей
    // Состояния для формы входа
    loginForm = {
        email: '',
        password: '',
        errors: {
            email: '',
            password: '',
            general: '',
        },
    };

    // Состояния для формы регистрации
    registerForm = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: '',
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            repeatPassword: '',
            general: '',
        },
    };

    constructor(rootStore) {
        this.rootStore = rootStore;

        makeObservable(this, {
            isAddressModalOpen: observable,
            currentUser: observable,
            users: observable,
            loginForm: observable,
            registerForm: observable,
            isLoading: observable,
            isModalLogin: observable,
            isModalRegister: observable,
            isModalChangePassword: observable,
            isModalForgotPassword: observable,
            cart: observable,
            wishlist: observable,
            bonuses: observable,
            setIsModalRegister: action,
            setIsModalLogin: action,
            setIsModalChangePassword: action,
            setIsModalForgotPassword: action,
            setCurrentUser: action,
            resetFormStates: action,
            resetReleativeData: action,
            login: action,
            logout: action,
            fetchUserProfile: action,
            registerUser: action,
            updateUser: action,
            getAllReleativeData: action,
            syncCart: action,
            toggleWishlistItem: action,
            getAllUsers: action,
            toggleUserBlock: action,
            clearWishlist: action,
            changePassword: action,
            isInWishlist: computed,
            setAddressModalOpen: action,
        });

        this.fetchUserProfile().then(r => {
        }).catch((e) => console.error(e));
    }

    get isInWishlist() {
        return (bouquetId) => {
            if (!this.currentUser || !this.wishlist) return false;
            return this.wishlist.some(item => item.id === bouquetId);
        };
    }

    // Регистрация пользователя
    async registerUser(userData) {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Включаем cookies
                body: JSON.stringify({
                    username: userData.firstName,
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone,
                    surname: userData.lastName,
                    role: userData.role,
                    force_password_change: userData.force_password_change,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка регистрации');
            }

            alert('Регистрация прошла успешно!');
            this.setIsModalRegister(false);
            this.resetFormStates();
            if (userData.role) {
                await this.getAllUsers();
            }
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Вход пользователя
    async login(credentials) {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });
            const data = await response.json();

            console.log('USER',data);

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            if (data.forcePasswordChange) {
                this.setIsModalChangePassword(true);
                return;
            }

            await this.fetchUserProfile();
            this.setIsModalLogin(false);
            this.resetFormStates();
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Получение профиля пользователя
    async fetchUserProfile() {
        try {
            this.isLoading = true;
            const response = await fetch('http://localhost:4000/profile', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            const prevOcpId = this.currentUser?.ocp_id;
            this.setCurrentUser(data.user);

            // Проверяем наличие адреса для пользователя с ролью customer
            if (data.user.role_name === 'customer') {
                if (!data.user.ocp_id) {
                    console.log('Opening address modal for user without address');
                    this.setAddressModalOpen(true);
                } else if (prevOcpId !== data.user.ocp_id) {
                    // Если OCP изменился, обновляем доступные количества
                    console.log('OCP changed, updating available quantities');
                    await this.rootStore.bouquetStore.updateAvailableQuantities(data.user.ocp_id);
                }
            }

            return data.user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Выход пользователя
    async logout() {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include', // Включаем cookies
            });

            if (!response.ok) {
                throw new Error('Ошибка выхода');
            }
            this.resetReleativeData();
            this.currentUser = null;
        } finally {
            this.isLoading = false;
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    setIsModalLogin(flag) {
        this.isModalLogin = flag;
    }

    setIsModalRegister(flag) {
        this.isModalRegister = flag;
    }

    setIsModalChangePassword(flag) {
        this.isModalChangePassword = flag;
    }

    setIsModalForgotPassword(flag) {
        this.isModalForgotPassword = flag;
    }

    resetFormStates() {
        this.loginForm = {
            email: '',
            password: '',
            errors: {
                email: '',
                password: '',
                general: '',
            },
        };

        this.registerForm = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            repeatPassword: '',
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                repeatPassword: '',
                general: '',
            },
        };
    }

    async updateUser(id, data) {
        try {
            const {data: result} = await this.rootStore.client.mutate({
                mutation: UPDATE_USER,
                variables: {id, dateOfBirth: data.date_of_birth, ...data},
            });

            const updated = result.updateUserById.user;

            if (!updated) throw new Error("user not updated")

            await this.fetchUserProfile();
            return this.currentUser
        } catch (error) {
            console.error('Error updating bouquet:', error);
        }
    }

    async getAllReleativeData(id) {
        this.isLoading = true;
        try {
            const {data} = await this.rootStore.client.query({
                query: GET_USER_RELATIVE_DATA,
                variables: {userId: id},
                fetchPolicy: 'network-only'
            });

            runInAction(() => {
                if (data) {
                    // Добавляем проверку на существование корзины
                    this.cart = data.getUserFullData.cart?.items || [];
                    this.wishlist = data.getUserFullData.wishlist || [];
                    this.bonuses = [];
                }
            });
            return {
                cart: this.cart,
                wishlist: this.wishlist,
                bonuses: this.bonuses
            };
        } catch (error) {
            console.error('Error fetching user relative data:', error);
            // Возвращаем пустые данные при ошибке
            runInAction(() => {
                this.cart = [];
                this.wishlist = [];
                this.bonuses = [];
            });
            return {
                cart: [],
                wishlist: [],
                bonuses: []
            };
        } finally {
            this.isLoading = false;
        }
    }

    resetReleativeData() {
        this.cart = [];
        this.wishlist = [];
        this.bonuses = [];
    }

    async syncCart(items) {
        if (!this.currentUser) return this.setIsModalLogin(true);

        try {
            // Разделяем элементы на обновления и удаления
            const updates = [];
            const deletes = [];

            items.forEach(item => {
                if (item.operation === 'delete') {
                    deletes.push({bouquetId: item.bouquetId});
                } else {
                    updates.push({
                        bouquetId: item.bouquetId,
                        quantity: item.quantity || 1,
                        addons: item.addons || []
                    });
                }
            });

            const {data} = await this.rootStore.client.mutate({
                mutation: SYNC_CART,
                variables: {
                    userId: this.currentUser.id,
                    updates,
                    deletes
                }
            });

            this.cart = data.syncCart.cart.items;
            return true;
        } catch (error) {
            console.error('Error syncing cart:', error);
            throw error;
        }
    }

    async toggleWishlistItem(bouquetId) {
        if (!this.currentUser) return this.setIsModalLogin(true);

        try {
            const {data} = await this.rootStore.client.mutate({
                mutation: TOGGLE_WISHLIST,
                variables: {
                    userId: this.currentUser.id,
                    bouquetId
                }
            });

            this.wishlist = data.toggleWishlistItem.wishlist;
            return this.isInWishlist(bouquetId);
        } catch (error) {
            console.error('Error toggling wishlist item:', error);
            throw error;
        }
    }

    async clearWishlist() {
        if (!this.currentUser) return this.setIsModalLogin(true);

        try {
            await this.rootStore.client.mutate({
                mutation: CLEAR_WISHLIST,
                variables: {userId: this.currentUser.id}
            });

            this.wishlist = [];
            return true;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    }

    // Получение списка всех пользователей
    async getAllUsers() {
        this.isLoading = true;
        try {
            const {data} = await this.rootStore.client.query({
                query: GET_ALL_USERS,
                fetchPolicy: 'network-only'
            });

            runInAction(() => {
                this.users = data.allUsers.nodes;
            });
            return this.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Блокировка/разблокировка пользователя
    async toggleUserBlock(userId, isBlocked) {
        try {
            const {data} = await this.rootStore.client.mutate({
                mutation: BLOCK_USER,
                variables: {
                    userId: Number(userId), // Явное преобразование в число
                    isBlocked: !isBlocked
                }
            });

            if (data?.blockUser?.success) {
                runInAction(() => {
                    // Создаём полностью новый массив для триггера обновления
                    const updatedUsers = this.users.map(user =>
                        user.id === userId
                            ? {
                                ...user,
                                isBlocked: !user.isBlocked, // Инвертируем текущее значение
                            }
                            : user
                    );
                    this.users = updatedUsers; // Полная замена массива
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error toggling user block:', error);
            throw error;
        }
    }

    // Добавляем метод для смены пароля
    async changePassword(currentPassword, newPassword) {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при смене пароля');
            }

            this.setIsModalChangePassword(false);
            await this.fetchUserProfile();
            return data;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async forgotPassword(email) {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при отправке запроса');
            }

            return data;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async resetPassword(token, newPassword) {
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при сбросе пароля');
            }

            return data;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateUserAddress(address) {
        try {
            this.isLoading = true;
            this.error = null;

            // Поиск адреса и получение координат
            const addressResults = await searchAddress(address);
            if (!addressResults || addressResults.length === 0) {
                throw new Error('Адрес не найден');
            }

            const { coordinates } = addressResults[0];

            // Поиск ближайшего ОЦП
            const nearestOCP = await findNearestOCP(coordinates.lat, coordinates.lon);
            if (!nearestOCP) {
                throw new Error('Не удалось найти ближайший ОЦП');
            }

            // Обновление данных пользователя через GraphQL
            const { data } = await this.rootStore.client.mutate({
                mutation: UPDATE_USER_ADDRESS,
                variables: {
                    id: this.currentUser.id,
                    address: address,
                    ocpId: nearestOCP.id
                }
            });

            if (!data.updateUserById.user) {
                throw new Error('Ошибка обновления адреса');
            }

            await this.fetchUserProfile();
            
            // Обновляем доступные количества букетов для нового OCP
            await this.rootStore.bouquetStore.updateAvailableQuantities(nearestOCP.id);
            
            this.setAddressModalOpen(false);
            return true;
        } catch (error) {
            this.error = error.message;
            return false;
        } finally {
            this.isLoading = false;
        }
    }
    setAddressModalOpen(flag) {
        this.isAddressModalOpen = flag;
    }
}