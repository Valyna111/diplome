import {UPDATE_USER} from '@/graphql/mutations';
import {action, makeObservable, observable} from 'mobx';
import {GET_USER_RELATIVE_DATA} from "@/graphql/queries";

export default class AuthStore {
    currentUser = null;
    isLoading = true;
    isModalLogin = false;
    isModalRegister = false;
    cart = [];
    wishlist = [];
    bonuses = [];
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
            currentUser: observable,
            loginForm: observable,
            registerForm: observable,
            isLoading: observable,
            isModalLogin: observable,
            isModalRegister: observable,
            setIsModalRegister: action,
            setIsModalLogin: action,
            setCurrentUser: action,
            resetFormStates: action,
            resetReleativeData: action,
            login: action,
            logout: action,
            fetchUserProfile: action,
            registerUser: action,
            updateUser: action,
            getAllReleativeData: action,
        });

        this.fetchUserProfile().then(r => {
        }).catch((e) => console.error(e));
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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка регистрации');
            }

            alert('Регистрация прошла успешно!');
            this.setIsModalRegister(false);
            this.resetFormStates();
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
                credentials: 'include', // Включаем cookies
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
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
        this.isLoading = true;
        try {
            const response = await fetch('http://localhost:4000/profile', {
                credentials: 'include', // Включаем cookies
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка получения профиля');
            }
            await this.getAllReleativeData(data.user.id);
            this.setCurrentUser(data.user);
        } catch (error) {
            this.currentUser = null;
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
                fetchPolicy: 'network-only' // Чтобы всегда получать свежие данные
            });

            if (data.user) {
                this.cart = data.user.cart.map(item => item.bouquet);
                this.wishlist = data.user.wishlist.map(item => item.bouquet);
                this.bonuses = data.user.bonuses.length > 0 ? data.user.bonuses[0].bonus : 0;
            }

            return {
                cart: this.cart,
                wishlist: this.wishlist,
                bonuses: this.bonuses
            };
        } catch (error) {
            console.error('Error fetching user relative data:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    resetReleativeData() {
        this.cart = [];
        this.wishlist = [];
        this.bonuses = [];
    }

    async addToCart(bouquetId) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await this.rootStore.client.mutate({
                mutation: ADD_TO_CART,
                variables: {
                    userId: this.currentUser.id,
                    bouquetId: bouquetId
                }
            });

            // Обновляем данные корзины
            await this.getAllReleativeData(this.currentUser.id);
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async removeFromCart(cartId) {
        try {
            await this.rootStore.client.mutate({
                mutation: REMOVE_FROM_CART,
                variables: {cartId}
            });

            // Обновляем данные корзины
            if (this.currentUser?.id) {
                await this.getAllReleativeData(this.currentUser.id);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    async addToWishlist(bouquetId) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await this.rootStore.client.mutate({
                mutation: ADD_TO_WISHLIST,
                variables: {
                    userId: this.currentUser.id,
                    bouquetId: bouquetId
                }
            });

            // Обновляем данные wishlist
            await this.getAllReleativeData(this.currentUser.id);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    }

    async removeFromWishlist(wishlistId) {
        try {
            await this.rootStore.client.mutate({
                mutation: REMOVE_FROM_WISHLIST,
                variables: {wishlistId}
            });

            // Обновляем данные wishlist
            if (this.currentUser?.id) {
                await this.getAllReleativeData(this.currentUser.id);
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    }
}