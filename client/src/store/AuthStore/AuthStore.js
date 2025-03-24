import { UPDATE_USER } from '@/graphql/mutations';
import { makeObservable, observable, action } from 'mobx';

export default class AuthStore {
  currentUser = null;
  isLoading = true;
  isModalLogin = false;
  isModalRegister = false;

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
      login: action,
      logout: action,
      fetchUserProfile: action,
      registerUser: action,
      updateUser: action
    });

    this.fetchUserProfile().then(r => {}).catch((e) => console.error(e));
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
              mutation: UPDATE_USER ,
              variables: {id, dateOfBirth: data.date_of_birth, ...data},
          });

          const updated = result.updateUserById.user;

          if(!updated) throw new Error("user not updated")
          
          this.fetchUserProfile();
          return this.currentUser
      } catch (error) {
          console.error('Error updating bouquet:', error);
      }
  }
}